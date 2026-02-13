export default function GameLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
      <div className="space-y-6 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-amber-200 border-t-amber-600" />
        <p className="text-sm text-slate-500">Loading game...</p>
      </div>
    </main>
  );
}
