import type { InputHTMLAttributes } from "react";
export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={`w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 ${props.className ?? ""}`} />; }
