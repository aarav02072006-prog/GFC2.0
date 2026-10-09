"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto min-h-[50vh] max-w-xl px-6 py-20 text-center"><h1 className="text-3xl font-bold">Something went wrong</h1><p className="mt-3 text-slate-600">Please try again.</p><button onClick={reset} className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">Try again</button></main>;
}
