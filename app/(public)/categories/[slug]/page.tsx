import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) { const slug = (await params).slug.toLowerCase(); const matches = products.filter((p) => p.category.toLowerCase() === slug); if (!matches.length) notFound(); return <main className="mx-auto min-h-screen max-w-7xl px-6 py-14"><p className="font-semibold uppercase tracking-wide text-indigo-600">Category</p><h1 className="mt-3 text-4xl font-bold capitalize">{slug}</h1><div className="mt-10"><ProductGrid products={matches} /></div></main>; }
