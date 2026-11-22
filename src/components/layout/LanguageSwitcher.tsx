'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('nav');
  const common = useTranslations('common');

  const switchLocale = (targetLocale: AppLocale) => {
    if (targetLocale === locale) return;
    const query = searchParams.toString();
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const destination = `${pathname}${query ? `?${query}` : ''}${hash}`;
    router.replace(destination, { locale: targetLocale });
  };

  return (
    <div
      role="group"
      aria-label={t('languageSwitcherLabel')}
      className={cn(
        'inline-flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-1 gap-1',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => switchLocale('en')}
        aria-pressed={locale === 'en'}
        className={cn(
          'min-h-[36px] min-w-[44px] cursor-pointer rounded-md px-2.5 py-1 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-ring)]',
          locale === 'en'
            ? 'bg-[var(--color-primary)] text-white shadow-xs'
            : 'text-[var(--color-foreground)] hover:bg-white/70',
        )}
      >
        {common('english')}
      </button>
      <button
        type="button"
        onClick={() => switchLocale('mr')}
        aria-pressed={locale === 'mr'}
        lang="mr"
        className={cn(
          'min-h-[36px] min-w-[44px] cursor-pointer rounded-md px-2.5 py-1 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-ring)]',
          locale === 'mr'
            ? 'bg-[var(--color-primary)] text-white shadow-xs'
            : 'text-[var(--color-foreground)] hover:bg-white/70',
        )}
      >
        {common('marathi')}
      </button>
    </div>
  );
}
