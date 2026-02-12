'use client';

import { Volume2, VolumeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
  className?: string;
}

export function SoundToggle({ enabled, onToggle, className }: SoundToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200',
        'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        className,
      )}
      aria-label={enabled ? 'Mute sounds' : 'Enable sounds'}
    >
      {enabled ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <VolumeOff className="h-4 w-4" />
      )}
    </button>
  );
}
