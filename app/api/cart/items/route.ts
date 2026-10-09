import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
export async function POST() { if (!(await getCurrentUser())) return NextResponse.json({ error: "Authentication required." }, { status: 401 }); return NextResponse.json({ error: "Cart persistence is not enabled in this starter flow." }, { status: 501 }); }
