'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle, mounted } = useTheme();

  return (
    <button
      onClick={toggle}
      className={cn(
        'relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200',
        'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        className,
      )}
      aria-label="Toggle theme"
    >
      {mounted && (
        theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
