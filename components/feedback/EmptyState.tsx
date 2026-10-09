import type { ReactNode } from "react";
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) { return <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center"><h2 className="font-semibold">{title}</h2>{children && <p className="mt-2 text-sm text-slate-500">{children}</p>}</div>; }
