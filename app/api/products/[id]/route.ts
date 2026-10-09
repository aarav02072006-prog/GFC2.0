import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) { const product = getProduct((await params).id); return product ? NextResponse.json({ data: product, source: "mock" }) : NextResponse.json({ error: "Product not found." }, { status: 404 }); }
