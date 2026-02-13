'use client';

import { Bot, Activity, Clock, Palette } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Bot className="h-6 w-6" />,
    title: 'Smart Bot Opponent',
    description:
      'Face an unbeatable minimax bot on hard mode, or ease in with random moves on easy mode.',
  },
  {
    icon: <Activity className="h-6 w-6" />,
    title: 'Real-time Game State',
    description:
      'Every move is validated server-side with instant UI updates. No cheating possible.',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Match History',
    description:
      'Track every game you play. Review wins, losses, and draws over time.',
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: 'Beautiful Design',
    description:
      'Animated SVG marks, smooth transitions, and a carefully crafted UI that feels great.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      {/* Subtle background accent */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(217,119,6,0.02) 50%, transparent)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeader />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
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
        Features
      </span>
      <h2
        className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Why Play XO?
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-base text-slate-500">
        Not just another tic-tac-toe. A polished experience built with modern web technology.
      </p>
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={cn(
        'group relative rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8',
        'transition-all duration-500',
        'hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/40',
        isVisible ? 'scroll-visible' : 'scroll-hidden',
      )}
      style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
    >
      <div className="mb-4 inline-flex rounded-xl bg-amber-50 p-3 text-amber-600 transition-colors group-hover:bg-amber-100">
        {feature.icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        {feature.description}
      </p>
    </div>
  );
}
