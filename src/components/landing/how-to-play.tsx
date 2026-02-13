'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Choose Your Mode',
    description:
      'Select Player vs Player to challenge a friend, or Player vs Bot to test your skills against the computer.',
  },
  {
    number: '02',
    title: 'Place Your Mark',
    description:
      'Tap any empty cell to place your X or O. Watch the satisfying draw animation as your mark appears.',
  },
  {
    number: '03',
    title: 'Win the Game',
    description:
      'Get three in a row — horizontally, vertically, or diagonally — to win. Track your score and review match history.',
  },
];

export function HowToPlay() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeader />

        <div className="mt-14 space-y-6 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-8">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={cn(
        'text-center transition-all duration-600',
        isVisible ? 'scroll-visible' : 'scroll-hidden',
      )}
    >
      <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
        Getting Started
      </span>
      <h2
        className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        How to Play
      </h2>
    </div>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={cn(
        'relative rounded-2xl p-6 text-center sm:p-8',
        'transition-all duration-500',
        isVisible ? 'scroll-visible' : 'scroll-hidden',
      )}
      style={{ transitionDelay: isVisible ? `${index * 120}ms` : '0ms' }}
    >
      {/* Step number */}
      <div
        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-600 text-xl font-bold text-white shadow-md shadow-amber-600/20"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {step.number}
      </div>

      {/* Connector line (between steps on desktop) */}
      {index < steps.length - 1 && (
        <div
          className="absolute top-11 left-[calc(50%+40px)] hidden h-px w-[calc(100%-80px)] bg-slate-200 sm:block"
          aria-hidden="true"
        />
      )}

      <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        {step.description}
      </p>
    </div>
  );
}
