import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
export default async function ProtectedLayout({ children }: { children: ReactNode }) { if (!(await getCurrentUser())) redirect("/login?next=%2Faccount"); return <>{children}</>; }
