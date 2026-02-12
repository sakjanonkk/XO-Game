'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GameError({ error, reset }: ErrorProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="max-w-sm space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <h2
          className="text-xl font-bold text-slate-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Something went wrong
        </h2>
        <p className="text-sm text-slate-500">
          {error.message || 'An unexpected error occurred while loading the game.'}
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </main>
  );
}
