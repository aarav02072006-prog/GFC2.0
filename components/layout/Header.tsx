"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function Header() {
  const pathname = usePathname();
  return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"><Link href="/" className="text-2xl font-bold tracking-tight">cliffesto<span className="text-indigo-600">.</span></Link><nav className="flex items-center gap-4 text-sm font-medium" aria-label="Main navigation"><Link className={pathname === "/products" ? "text-indigo-600" : "hover:text-indigo-600"} href="/products">Products</Link><Link className="hidden hover:text-indigo-600 sm:inline" href="/search">Search</Link><Link className="hidden hover:text-indigo-600 sm:inline" href="/account">Account</Link><Link className="rounded-full bg-slate-900 px-5 py-2.5 text-white hover:bg-indigo-600" href="/cart">Cart</Link></nav></div></header>;
}
