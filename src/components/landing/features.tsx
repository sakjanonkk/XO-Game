'use client';

import { Bot, Activity, Clock } from 'lucide-react';
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
    title: 'Play vs Bot',
    description:
      'Two difficulty levels — random moves for casual play, or minimax for a real challenge.',
  },
  {
    icon: <Activity className="h-6 w-6" />,
    title: 'Online PvP',
    description:
      'Share a link and play with friends. Moves sync in real-time via server-sent events.',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Match History',
    description:
      'All your games are saved. Check past results and replay any finished match move-by-move.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeader />

        <div className="mt-14 grid gap-6 sm:grid-cols-3 sm:gap-8">
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
      <h2
        className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Features
      </h2>
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8',
        'transition-all duration-500',
        isVisible ? 'scroll-visible' : 'scroll-hidden',
      )}
      style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
    >
      <div className="mb-4 inline-flex rounded-xl bg-amber-50 p-3 text-amber-600">
        {feature.icon}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        {feature.description}
      </p>
    </div>
  );
}
