'use client';

import * as React from 'react';
import gsap from 'gsap';
import type { AppLocale } from '@/i18n/routing';
import { formatINR, formatIndianCompact } from '@/lib/formatters';
import { cn } from '@/lib/utils';

export function AnimatedINR({
  value,
  format = 'full',
  locale,
  className,
}: {
  value: number;
  format?: 'full' | 'compact';
  locale: AppLocale;
  className?: string;
}) {
  const [rendered, setRendered] = React.useState(value);
  const proxyRef = React.useRef({ val: value });
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      proxyRef.current.val = value;
      setRendered(value);
      return;
    }

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      proxyRef.current.val = value;
      setRendered(value);
      return;
    }

    const tween = gsap.to(proxyRef.current, {
      val: value,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
      onUpdate: () => {
        setRendered(Math.round(proxyRef.current.val));
      },
      onComplete: () => {
        setRendered(value);
      },
    });

    return () => {
      tween.kill();
    };
  }, [value]);

  const formatted =
    format === 'compact'
      ? formatIndianCompact(rendered, locale)
      : formatINR(rendered);

  return <span className={cn('numeric-tabular', className)}>{formatted}</span>;
}
