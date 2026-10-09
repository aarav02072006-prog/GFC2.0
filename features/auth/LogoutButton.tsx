"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function logout() {
    setBusy(true);
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) router.push("/login");
    else setBusy(false);
  }
  return <button type="button" disabled={busy} onClick={logout} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:border-indigo-600 disabled:opacity-50">{busy ? "Signing out..." : "Sign out"}</button>;
}
