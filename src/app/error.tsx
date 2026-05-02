"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center gap-3 px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="text-[color:var(--color-muted-fg)]">
        Please try again. If the problem persists, contact support.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm hover:bg-[color:var(--color-muted)]"
      >
        Try again
      </button>
    </main>
  );
}
