'use client';

import * as React from 'react';
import { useGSAP } from '@gsap/react';
import { getGsapWithScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export function HeroMotion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scopeRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const items = scope.querySelectorAll('[data-hero-item]');
      if (items.length === 0) return;

      const { gsap } = getGsapWithScrollTrigger();
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(items, {
          opacity: 0,
          y: 10,
          duration: 0.38,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        });
      });

      return () => mm.revert();
    },
    { scope: scopeRef },
  );

  return (
    <div ref={scopeRef} className={cn(className)}>
      {children}
    </div>
  );
}
