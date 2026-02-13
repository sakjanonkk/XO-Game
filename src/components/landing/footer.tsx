import { Gamepad2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white/50 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Gamepad2 className="h-4 w-4 text-amber-600" />
            <span style={{ fontFamily: 'var(--font-heading)' }}>XO Game</span>
          </div>

          <p className="text-xs text-slate-400">
            Built with Next.js, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
