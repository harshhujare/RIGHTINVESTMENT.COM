import * as React from 'react';
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { CalculatorsHub } from '@/components/calculators/CalculatorsHub';
import { ConsultationBanner } from '@/components/sections/ConsultationBanner';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = hasLocale(routing.locales, locale) ? locale : 'en';
  const t = await getTranslations({
    locale: activeLocale,
    namespace: 'metadata',
  });
  return {
    title: t('calculatorsTitle'),
    description: t('calculatorsDescription'),
    alternates: {
      languages: {
        'en-IN': '/en/calculators',
        'mr-IN': '/mr/calculators',
      },
    },
  };
}

export default async function CalculatorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale = hasLocale(routing.locales, locale) ? locale : 'en';
  setRequestLocale(activeLocale);

  return (
    <>
      <div
        lang="en"
        className="font-[family-name:var(--font-latin)]"
      >
        <section className="border-b border-[var(--color-border)] bg-[var(--color-background)] py-10 sm:py-14">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <React.Suspense
              fallback={
                <div className="h-[540px] w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 text-sm text-[var(--color-muted-foreground)]">
                  Loading calculators...
                </div>
              }
            >
              <CalculatorsHub />
            </React.Suspense>
          </div>
        </section>
      </div>

      <ConsultationBanner />
    </>
  );
}
