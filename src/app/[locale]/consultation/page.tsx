import * as React from 'react';
import type { Metadata } from 'next';
import {
  CalendarCheck,
  Clock,
  LockKey,
  Phone,
  WhatsappLogo,
} from '@phosphor-icons/react/dist/ssr';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type AppLocale } from '@/i18n/routing';
import { ADVISER_CONFIG, getWhatsAppHref } from '@/lib/compliance';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ConsultationForm } from '@/components/forms/ConsultationForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = hasLocale(routing.locales, locale) ? locale : 'en';
  const t = await getTranslations({ locale: activeLocale, namespace: 'metadata' });
  return {
    title: t('consultationTitle'),
    description: t('consultationDescription'),
    alternates: {
      languages: {
        'en-IN': '/en/consultation',
        'mr-IN': '/mr/consultation',
      },
    },
  };
}

export default async function ConsultationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale = (
    hasLocale(routing.locales, locale) ? locale : 'en'
  ) as AppLocale;
  setRequestLocale(activeLocale);

  const t = await getTranslations('consultationPage');
  const expectSteps = t.raw('expectSteps') as Array<{
    title: string;
    detail: string;
  }>;

  return (
    <section className="bg-[var(--color-background)] py-12 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="max-w-[65ch]">
          <Badge variant="primary" className="mb-3">
            {t('eyebrow')}
          </Badge>
          <h1 className="heading-balance text-3xl font-bold text-[var(--color-secondary)] sm:text-4xl">
            {t('heading')}
          </h1>
          <p className="mt-3 text-base text-[var(--color-muted-foreground)] sm:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left 5 Columns: Agenda, Direct Contact & Zero-Spam Pledge */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Card className="p-6">
              <h2 className="text-lg font-bold text-[var(--color-secondary)]">
                {t('expectTitle')}
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {expectSteps.map((step) => (
                  <div key={step.title} className="bilingual-flow">
                    <h3 className="text-sm font-bold text-[var(--color-primary)]">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                      {step.detail}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-bold text-[var(--color-secondary)]">
                {t('directTitle')}
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href={ADVISER_CONFIG.phoneHref}
                  className="flex min-h-[48px] items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm font-semibold text-[var(--color-secondary)] transition-colors hover:border-[var(--color-primary)]"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Phone
                      size={18}
                      weight="regular"
                      className="text-[var(--color-primary)]"
                      aria-hidden="true"
                    />
                    <span>{t('callLabel')}</span>
                  </span>
                  <span className="numeric-tabular text-[var(--color-primary)]">
                    {ADVISER_CONFIG.phoneDisplay}
                  </span>
                </a>

                <a
                  href={getWhatsAppHref(activeLocale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[48px] items-center justify-between gap-3 rounded-lg border border-[var(--color-growth-text)]/30 bg-[var(--color-growth-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-growth-pill-text)] transition-colors hover:bg-[#DCF1D9]"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <WhatsappLogo size={19} weight="regular" aria-hidden="true" />
                    <span>{t('whatsappLabel')}</span>
                  </span>
                  <span className="numeric-tabular">
                    {ADVISER_CONFIG.phoneDisplay}
                  </span>
                </a>

                {ADVISER_CONFIG.calendlyUrl ? (
                  <a
                    href={ADVISER_CONFIG.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[48px] items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]"
                  >
                    <CalendarCheck size={18} weight="regular" aria-hidden="true" />
                    <span>{t('calendlyLabel')}</span>
                  </a>
                ) : null}

                <div className="mt-1 flex items-start gap-2.5 text-xs text-[var(--color-muted-foreground)]">
                  <Clock size={16} weight="regular" className="mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[var(--color-foreground)]">
                      {t('officeLabel')}
                    </p>
                    <p>
                      {activeLocale === 'mr'
                        ? ADVISER_CONFIG.officeHoursMr
                        : ADVISER_CONFIG.officeHoursEn}
                    </p>
                    <p>
                      {activeLocale === 'mr'
                        ? ADVISER_CONFIG.officeCityMr
                        : ADVISER_CONFIG.officeCityEn}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-[var(--color-primary)]/20 bg-[var(--color-primary-soft)] p-5">
              <div className="flex items-start gap-3">
                <LockKey
                  size={20}
                  weight="regular"
                  className="mt-0.5 shrink-0 text-[var(--color-primary)]"
                  aria-hidden="true"
                />
                <div className="bilingual-flow">
                  <h2 className="text-sm font-bold text-[var(--color-primary)]">
                    {t('pledgeTitle')}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--color-foreground)]">
                    {t('pledgeCopy')}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right 7 Columns: Lean 5-Field Consultation Form */}
          <div className="lg:col-span-7">
            <React.Suspense
              fallback={
                <Card className="h-[520px] p-8">
                  <div className="h-6 w-48 rounded bg-[var(--color-muted)]" />
                </Card>
              }
            >
              <ConsultationForm />
            </React.Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
