import Link from "next/link";
import { EmptyState } from "@/components/feedback/EmptyState";
export default function OrdersPage() { return <main className="mx-auto min-h-screen max-w-4xl px-6 py-14"><h1 className="text-4xl font-bold">Order history</h1><div className="mt-8"><EmptyState title="No orders yet">Your completed orders will appear here. <Link href="/products" className="text-indigo-600">Start shopping</Link></EmptyState></div></main>; }
