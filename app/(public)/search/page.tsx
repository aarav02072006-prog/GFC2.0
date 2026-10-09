import { ProductBrowser } from "@/features/products/ProductBrowser";
import { products } from "@/lib/products";
export default function SearchPage() { return <main className="mx-auto min-h-screen max-w-7xl px-6 py-14"><h1 className="text-4xl font-bold">Search products</h1><p className="mt-3 mb-10 text-slate-600">Find something useful for your everyday.</p><ProductBrowser products={products} /></main>; }
