'use client';

import * as React from 'react';
import { useGSAP } from '@gsap/react';
import { getGsapWithScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export function StaggerReveal({
  children,
  className,
  stagger = 0.08,
  yOffset = 16,
  connectorSelector,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  yOffset?: number;
  connectorSelector?: string;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const items = container.querySelectorAll('[data-stagger-item]');
      const connector = connectorSelector
        ? container.querySelector(connectorSelector)
        : null;

      const { gsap } = getGsapWithScrollTrigger();
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (items.length > 0) {
          gsap.from(items, {
            opacity: 0,
            y: yOffset,
            duration: 0.4,
            stagger,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: container,
              start: 'top 86%',
              once: true,
            },
          });
        }

        if (connector) {
          gsap.from(connector, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.65,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              once: true,
            },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [stagger, yOffset, connectorSelector] },
  );

  return (
    <div ref={containerRef} className={cn(className)}>
      {children}
    </div>
  );
}
