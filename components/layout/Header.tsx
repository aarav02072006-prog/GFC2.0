"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { popularSearches } from "@/lib/popular-searches";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import type { CatalogProduct } from "@/lib/catalog";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<CatalogProduct[]>([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);
  const { searches, add, remove, clear } = useRecentSearches();

  useEffect(() => {
    const syncInput = () => setInput(new URLSearchParams(window.location.search).get("q") ?? "");
    const timer = window.setTimeout(syncInput, 0);
    window.addEventListener("popstate", syncInput);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("popstate", syncInput);
    };
  }, [pathname]);

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) {
      if (!searchRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  useEffect(() => {
    const query = input.trim();
    if (!open || !query) {
      const timer = window.setTimeout(() => {
        setSuggestions([]);
        setSuggestionLoading(false);
      }, 0);
      return () => window.clearTimeout(timer);
    }
    const id = ++requestId.current;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSuggestionLoading(true);
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}&limit=5`, { signal: controller.signal });
        const body = await response.json() as { data?: CatalogProduct[] };
        if (id === requestId.current) {
          setSuggestions(body.data ?? []);
          setActiveIndex(-1);
        }
      } catch (error) {
        if ((error as { name?: string }).name !== "AbortError") setSuggestions([]);
      } finally {
        if (id === requestId.current) setSuggestionLoading(false);
      }
    }, 220);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [input, open]);

  function navigate(value: string) {
    const normalized = value.trim().replace(/\s+/g, " ");
    if (!normalized) {
      router.push("/search");
      setOpen(false);
      return;
    }
    add(normalized);
    router.push(`/search?q=${encodeURIComponent(normalized)}`);
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const items = suggestions;
    if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "ArrowDown" && items.length) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % items.length);
    } else if (event.key === "ArrowUp" && items.length) {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + items.length) % items.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0) {
        add(items[activeIndex].name);
        router.push(`/products/${items[activeIndex].id}`);
        setOpen(false);
      } else {
        navigate(input);
      }
    }
  }

  const showRecent = open && !input.trim() && searches.length > 0;
  const showPopular = open && !input.trim();
  return <header className="border-b border-slate-200 bg-white">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
      <Link href="/" className="shrink-0 text-2xl font-bold tracking-tight">cliffesto<span className="text-indigo-600">.</span></Link>
      <div ref={searchRef} className="relative order-3 w-full sm:order-none sm:flex-1">
      
<form
  onSubmit={(event) => {
    event.preventDefault();
    navigate(input);
  }}
  role="search"
  className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 transition-colors focus-within:border-slate-200 focus-within:bg-white focus-within:ring-0"
>
  <span aria-hidden="true" className="shrink-0 text-slate-400">
    ⌕
  </span>

  <label htmlFor="navbar-search" className="sr-only">
    Search products and categories
  </label>

  <input
    id="navbar-search"
    type="search"
    value={input}
    onFocus={() => setOpen(true)}
    onChange={(event) => {
      setInput(event.target.value);
      setOpen(true);
    }}
    onKeyDown={onKeyDown}
    placeholder="Search products, categories..."
    autoComplete="off"
    aria-controls="navbar-search-dropdown"
    className="min-w-0 flex-1 appearance-none border-0 bg-transparent py-3 text-base text-slate-800 outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden"
  />

  {input && (
    <button
      type="button"
      onClick={() => {
        setInput("");
        setOpen(true);
      }}
      aria-label="Clear search"
      className="shrink-0 px-2 text-xl text-slate-400 hover:text-slate-700"
    >
      ×
    </button>
  )}

  <button
    type="submit"
    aria-label="Submit search"
    className="shrink-0 min-h-11 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800"
  >
    Search
  </button>
</form>

        {open && <div id="navbar-search-dropdown" className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-xl" role="listbox">
          {input.trim() ? <div>
            {suggestionLoading && <p className="p-3 text-sm text-slate-500">Finding products...</p>}
            {!suggestionLoading && suggestions.map((product, index) => <button key={product.id} type="button" onClick={() => { add(product.name); router.push(`/products/${product.id}`); setOpen(false); }} className={`flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-slate-50 ${activeIndex === index ? "bg-slate-50" : ""}`} role="option" aria-selected={activeIndex === index}>
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-slate-100">{product.imageUrl ? <Image src={product.imageUrl} alt="" fill sizes="40px" className="object-cover" /> : <span className="flex h-full items-center justify-center">{product.emoji}</span>}</div>
              <span><strong className="block text-sm">{product.name}</strong><small className="text-slate-500">{product.category}</small></span>
            </button>)}
            {!suggestionLoading && !suggestions.length && <p className="p-3 text-sm text-slate-500">No product suggestions. Press Enter to search.</p>}
          </div> : <div className="space-y-4">
            {showRecent && <section><div className="flex items-center justify-between px-2"><h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recent searches</h2><button type="button" onClick={clear} className="text-xs text-indigo-600">Clear all</button></div><div className="mt-2 flex flex-wrap gap-2">{searches.map((search) => <span key={search} className="inline-flex items-center rounded-full bg-slate-100 text-sm"><button type="button" onClick={() => navigate(search)} className="px-3 py-1.5">{search}</button><button type="button" onClick={() => remove(search)} aria-label={`Remove ${search}`} className="px-2 text-slate-400 hover:text-red-600">×</button></span>)}</div></section>}
            {showPopular && <section><h2 className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Popular searches</h2><div className="mt-2 flex flex-wrap gap-2">{popularSearches.map((search) => <button key={search} type="button" onClick={() => navigate(search)} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm hover:border-indigo-500 hover:text-indigo-600">{search}</button>)}</div></section>}
          </div>}
        </div>}
      </div>
      <nav className="ml-auto flex items-center gap-3 text-sm font-medium" aria-label="Main navigation">
<ThemeToggle />

<Link
  href="/account"
  aria-label="Account"
  className="group relative inline-flex items-center justify-center rounded-full
             border border-slate-200 bg-white p-3 text-slate-700
             shadow-sm transition-all duration-200 ease-out
             hover:scale-110 hover:border-indigo-200 hover:bg-indigo-50
             hover:text-indigo-600 hover:shadow-md
             active:scale-95
             focus-visible:outline-none focus-visible:ring-2
             focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
>
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[21px] w-[21px] transition-transform duration-200 group-hover:scale-110">
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="8" r="4" />
  </svg>
</Link>
<Link
  href="/cart"
  aria-label="Shopping cart"
  className="group relative inline-flex items-center justify-center rounded-full
             border border-slate-200 bg-white p-3 text-slate-700
             shadow-sm transition-all duration-200 ease-out
             hover:scale-110 hover:border-indigo-200 hover:bg-indigo-50
             hover:text-indigo-600 hover:shadow-md
             active:scale-95
             focus-visible:outline-none focus-visible:ring-2
             focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
>
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[21px] w-[21px] transition-transform duration-200 group-hover:scale-110">
    <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6" />
    <circle cx="10" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
  </svg>
</Link>
      </nav>
    </div>
  </header>;
}
