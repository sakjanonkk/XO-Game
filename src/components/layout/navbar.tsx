import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Gamepad2 className="h-5 w-5 text-indigo-600" />
          XO Game
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/game">
            <Button size="sm">Play Now</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
