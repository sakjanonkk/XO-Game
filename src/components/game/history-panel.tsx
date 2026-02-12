'use client';

import { useCallback, useEffect, useState } from 'react';
import { Clock, Trophy, Minus, X as XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getHistory } from '@/lib/api-client';
import type { GameHistoryEntry } from '@/types/game';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const [entries, setEntries] = useState<GameHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getHistory();
      setEntries(data);
    } catch {
      // Silently handle — panel just shows empty state
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen, fetchHistory]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-2xl border-l border-slate-200',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="Match history"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-800">Match History</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close history panel"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-4" style={{ height: 'calc(100% - 57px)' }}>
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
            </div>
          )}

          {!isLoading && entries.length === 0 && (
            <p className="py-12 text-center text-sm text-slate-400">
              No completed games yet
            </p>
          )}

          {!isLoading && entries.length > 0 && (
            <ul className="space-y-2">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-lg border border-slate-100 bg-slate-50/50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {entry.winner ? (
                        <Trophy className="h-3.5 w-3.5 text-amber-500" />
                      ) : (
                        <Minus className="h-3.5 w-3.5 text-slate-400" />
                      )}
                      <span className="text-sm font-medium text-slate-700">
                        {entry.winner
                          ? `${entry.winner} won`
                          : 'Draw'}
                      </span>
                    </div>
                    <span className="rounded-full bg-slate-200/60 px-2 py-0.5 text-xs text-slate-500">
                      {entry.mode === 'ai' ? `AI (${entry.aiDifficulty})` : 'PvP'}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
                    <span>{entry.moveCount} moves</span>
                    <span>{formatTimestamp(entry.completedAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;

  return date.toLocaleDateString();
}
