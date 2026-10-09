import { NextResponse } from "next/server";
export async function POST() { return NextResponse.json({ error: "Payment webhook provider is not configured." }, { status: 501 }); }
