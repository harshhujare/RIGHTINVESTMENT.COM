'use client';

import * as React from 'react';
import { useGSAP } from '@gsap/react';
import { usePathname } from '@/i18n/navigation';
import { getGsapWithScrollTrigger } from '@/lib/gsap';

export function ScrollProgressBar() {
  const barRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const bar = barRef.current;
      if (!bar) return;

      const { gsap } = getGsapWithScrollTrigger();
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.2,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { dependencies: [pathname] },
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[2.5px] overflow-hidden bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-growth-brand)]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
