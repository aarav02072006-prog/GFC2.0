import Link from "next/link";
export default function NotFound() {
  return <main className="mx-auto min-h-[60vh] max-w-xl px-6 py-24 text-center"><p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">404</p><h1 className="mt-3 text-4xl font-bold">Page not found</h1><Link href="/products" className="mt-8 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">Browse products</Link></main>;
}
