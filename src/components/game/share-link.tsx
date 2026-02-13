'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, Copy, Link } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareLinkProps {
  gameId: string;
  className?: string;
}

export function ShareLink({ gameId, className }: ShareLinkProps) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/game/${gameId}`);
  }, [gameId]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  if (!url) return null;

  return (
    <div
      className={cn(
        'rounded-xl border border-amber-200 bg-amber-50/50 p-4',
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
        <Link className="h-3.5 w-3.5" />
        Share with opponent
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={url}
          className="flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
          onFocus={(e) => e.target.select()}
        />
        <button
          onClick={copyToClipboard}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
            copied
              ? 'bg-emerald-500 text-white'
              : 'bg-amber-600 text-white hover:bg-amber-700',
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Send this link to your friend — they&apos;ll play as O
      </p>
    </div>
  );
}
