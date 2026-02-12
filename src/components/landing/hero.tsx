'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParallax } from '@/hooks/useParallax';
import { useCallback } from 'react';

export function Hero() {
  const { registerLayer } = useParallax();

  const gridRef = useCallback(
    (el: HTMLDivElement | null) => registerLayer(el, -0.15),
    [registerLayer],
  );

  const floatingRef = useCallback(
    (el: HTMLDivElement | null) => registerLayer(el, -0.3),
    [registerLayer],
  );

  return (
    <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-36">
      {/* Parallax grid background */}
      <div
        ref={gridRef}
        className="parallax-grid absolute inset-0 -z-10"
        aria-hidden="true"
      />

      {/* Floating XO decorations */}
      <div
        ref={floatingRef}
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* Large faded X top-right */}
        <svg
          viewBox="0 0 100 100"
          className="absolute -top-8 -right-8 h-64 w-64 text-indigo-600/[0.04] animate-float sm:h-80 sm:w-80"
        >
          <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          <line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        </svg>

        {/* Large faded O bottom-left */}
        <svg
          viewBox="0 0 100 100"
          className="absolute -bottom-12 -left-12 h-72 w-72 text-amber-500/[0.05] animate-float sm:h-96 sm:w-96"
          style={{ animationDelay: '2s' }}
        >
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="7" />
        </svg>

        {/* Small decorative X */}
        <svg
          viewBox="0 0 100 100"
          className="absolute top-1/3 left-[10%] h-16 w-16 text-indigo-500/[0.06] animate-float"
          style={{ animationDelay: '4s' }}
        >
          <line x1="25" y1="25" x2="75" y2="75" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
          <line x1="75" y1="25" x2="25" y2="75" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        </svg>

        {/* Small decorative O */}
        <svg
          viewBox="0 0 100 100"
          className="absolute top-1/4 right-[15%] h-20 w-20 text-amber-400/[0.06] animate-float"
          style={{ animationDelay: '3s' }}
        >
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="9" />
        </svg>
      </div>

      {/* Radial gradient accent */}
      <div
        className="absolute top-0 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-[0.08]"
        style={{
          background: 'radial-gradient(ellipse, #4F46E5 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <div className="animate-slide-up">
          <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            Classic Reimagined
          </span>
        </div>

        <h1
          className="animate-slide-up text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          style={{
            fontFamily: 'var(--font-heading)',
            animationDelay: '0.1s',
          }}
        >
          The Ultimate{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            XO
          </span>{' '}
          Experience
        </h1>

        <p
          className="mx-auto mt-5 max-w-xl animate-slide-up text-base leading-relaxed text-slate-600 sm:mt-6 sm:text-lg"
          style={{ animationDelay: '0.2s' }}
        >
          Challenge an unbeatable AI or play with friends. Beautiful animations,
          real-time game tracking, and a satisfying experience — all in your browser.
        </p>

        <div
          className="mt-8 flex animate-slide-up items-center justify-center gap-4 sm:mt-10"
          style={{ animationDelay: '0.3s' }}
        >
          <Link href="/game">
            <Button size="lg" className="group">
              Play Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Learn more
          </a>
        </div>

        {/* Mini board preview */}
        <div
          className="mx-auto mt-12 max-w-[200px] animate-slide-up sm:mt-16"
          style={{ animationDelay: '0.5s' }}
        >
          <PreviewBoard />
        </div>
      </div>
    </section>
  );
}

function PreviewBoard() {
  const cells: (string | null)[] = ['X', null, 'O', null, 'X', null, 'O', null, 'X'];

  return (
    <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-slate-100/80 p-2 shadow-lg shadow-slate-200/60">
      {cells.map((cell, i) => (
        <div
          key={i}
          className="flex aspect-square items-center justify-center rounded-lg bg-white shadow-sm text-sm font-bold"
        >
          {cell === 'X' && (
            <span className="text-indigo-600">X</span>
          )}
          {cell === 'O' && (
            <span className="text-amber-500">O</span>
          )}
        </div>
      ))}
    </div>
  );
}
