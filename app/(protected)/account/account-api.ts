import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function authorizeAccountRequest(requireSameOrigin = false) {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const host = requestHeaders.get("host");

  if (requireSameOrigin) {
    if (!origin || !host) {
      return NextResponse.json(
        { error: "A same-origin request is required." },
        { status: 403 },
      );
    }

    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json(
          { error: "A same-origin request is required." },
          { status: 403 },
        );
      }
    } catch {
      return NextResponse.json(
        { error: "A valid request origin is required." },
        { status: 403 },
      );
    }
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  return user;
}
