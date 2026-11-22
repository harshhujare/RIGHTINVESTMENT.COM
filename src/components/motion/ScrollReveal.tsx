'use client';

import * as React from 'react';
import { useGSAP } from '@gsap/react';
import { getGsapWithScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export function ScrollReveal({
  children,
  className,
  delay = 0,
  yOffset = 12,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const target = containerRef.current;
      if (!target) return;

      const { gsap } = getGsapWithScrollTrigger();
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(target, {
          opacity: 0,
          y: yOffset,
          duration: 0.35,
          delay,
          ease: 'power1.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: target,
            start: 'top 90%',
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [delay, yOffset] },
  );

  return (
    <div ref={containerRef} className={cn(className)}>
      {children}
    </div>
  );
}
