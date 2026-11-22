'use client';

import * as React from 'react';
import Lenis from 'lenis';
import { usePathname } from '@/i18n/navigation';
import { getGsapWithScrollTrigger } from '@/lib/gsap';

const HEADER_OFFSET = -92;

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const lenisRef = React.useRef<Lenis | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reducedMotion) return;

    const { gsap, ScrollTrigger } = getGsapWithScrollTrigger();

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Smoothly handle same-page hash anchor clicks with sticky header offset
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const rawHref = anchor.getAttribute('href');
      if (!rawHref || rawHref === '#') return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (
        url.origin === window.location.origin &&
        url.pathname === window.location.pathname &&
        url.hash
      ) {
        const destEl = document.getElementById(url.hash.slice(1));
        if (destEl) {
          event.preventDefault();
          lenis.scrollTo(destEl, { offset: HEADER_OFFSET });
          window.history.pushState(null, '', url.hash);
        }
      }
    };

    document.addEventListener('click', onDocumentClick);

    return () => {
      document.removeEventListener('click', onDocumentClick);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll / refresh ScrollTrigger cleanly on route change
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const { ScrollTrigger } = getGsapWithScrollTrigger();

    const hash = window.location.hash;
    if (hash) {
      const destEl = document.getElementById(hash.slice(1));
      if (destEl && lenisRef.current) {
        lenisRef.current.scrollTo(destEl, { offset: HEADER_OFFSET });
      }
    } else if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }

    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}
