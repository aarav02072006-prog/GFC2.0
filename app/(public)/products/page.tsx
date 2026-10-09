import { ProductBrowser } from "@/features/products/ProductBrowser";
import { products } from "@/lib/products";
export default function ProductsPage() { return <main className="mx-auto min-h-screen max-w-7xl px-6 py-14"><p className="font-semibold uppercase tracking-wide text-indigo-600">The collection</p><h1 className="mt-3 text-4xl font-bold">Products</h1><p className="mt-4 mb-10 max-w-2xl text-slate-600">Useful, well-made products selected for everyday routines. <span className="text-xs">(Demo catalog)</span></p><ProductBrowser products={products} /></main>; }
