import { NextResponse } from "next/server";
import { revokeCurrentSession, requireSameOrigin } from "@/lib/auth";

export async function POST() {
  try {
    await requireSameOrigin();
    await revokeCurrentSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Logout error", error);
    return NextResponse.json({ error: "Unable to sign out." }, { status: 503 });
  }
}
