type ComingSoonProps = {
  title?: string;
  hint?: string;
};

export function ComingSoon({
  title = "Coming soon",
  hint = "This page is part of the FreshTerra Web scaffold and will be implemented per its PRD.",
}: ComingSoonProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center gap-3 px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="text-[color:var(--color-muted-fg)]">{hint}</p>
    </main>
  );
}
