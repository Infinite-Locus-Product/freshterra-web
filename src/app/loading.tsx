export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="bg-cream-50 flex min-h-screen items-center justify-center"
    >
      <div className="border-brand-500 size-12 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  );
}
