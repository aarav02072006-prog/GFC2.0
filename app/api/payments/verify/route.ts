import { NextResponse } from "next/server";
export async function POST() { return NextResponse.json({ error: "Payment verification is unavailable without a configured provider." }, { status: 501 }); }
