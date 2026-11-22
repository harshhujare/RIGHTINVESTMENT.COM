'use client';

import * as React from 'react';
import type { AppLocale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

function splitGraphemes(text: string, locale: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(locale, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (seg) => seg.segment);
  }
  return Array.from(text);
}

export function TypingText({
  prefix,
  phrases,
  locale,
  className,
}: {
  prefix: string;
  phrases: string[];
  locale: AppLocale;
  className?: string;
}) {
  const safePhrases = React.useMemo(
    () => (phrases.length > 0 ? phrases : ['']),
    [phrases],
  );

  const [displayText, setDisplayText] = React.useState(safePhrases[0]);
  const [paused, setPaused] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  const stateRef = React.useRef({
    phraseIndex: 0,
    graphemeCount: splitGraphemes(safePhrases[0], locale).length,
    deleting: false,
  });

  // Reset cleanly when locale or phrases change
  React.useEffect(() => {
    const initial = safePhrases[0];
    stateRef.current = {
      phraseIndex: 0,
      graphemeCount: splitGraphemes(initial, locale).length,
      deleting: false,
    };
    setDisplayText(initial);
  }, [locale, safePhrases]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  React.useEffect(() => {
    if (reducedMotion || paused || safePhrases.length <= 1) return;

    let timeoutId: number;

    const step = () => {
      const current = stateRef.current;
      const phrase = safePhrases[current.phraseIndex] ?? '';
      const graphemes = splitGraphemes(phrase, locale);

      if (!current.deleting) {
        if (current.graphemeCount < graphemes.length) {
          current.graphemeCount += 1;
          setDisplayText(graphemes.slice(0, current.graphemeCount).join(''));
          timeoutId = window.setTimeout(step, 46);
        } else {
          current.deleting = true;
          timeoutId = window.setTimeout(step, 2400);
        }
      } else if (current.graphemeCount > 0) {
        current.graphemeCount -= 1;
        setDisplayText(graphemes.slice(0, current.graphemeCount).join(''));
        timeoutId = window.setTimeout(step, 24);
      } else {
        current.deleting = false;
        current.phraseIndex = (current.phraseIndex + 1) % safePhrases.length;
        timeoutId = window.setTimeout(step, 320);
      }
    };

    // Start first delete pause cleanly after initial phrase has been read
    timeoutId = window.setTimeout(step, 2400);

    return () => window.clearTimeout(timeoutId);
  }, [locale, paused, reducedMotion, safePhrases]);

  return (
    <div
      className={cn(
        'bilingual-flow inline-flex min-h-[2.1rem] flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm font-medium text-[var(--color-muted-foreground)] sm:text-base',
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      tabIndex={0}
    >
      <span>{prefix}</span>
      <span className="sr-only">{safePhrases.join(', ')}</span>
      <span
        aria-hidden="true"
        className="inline-flex items-baseline font-semibold text-[var(--color-primary)]"
      >
        <span>{reducedMotion ? safePhrases[0] : displayText}</span>
        {!reducedMotion && (
          <span className="typing-caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.12em] bg-[var(--color-growth-text)]" />
        )}
      </span>
    </div>
  );
}
