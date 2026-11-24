import type { Metadata } from 'next';
import {
  ArrowRight,
  Calculator,
  Check,
  Compass,
  ShieldCheck,
  TrendUp,
} from '@phosphor-icons/react/dist/ssr';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConsultationBanner } from '@/components/sections/ConsultationBanner';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = hasLocale(routing.locales, locale) ? locale : 'en';
  const t = await getTranslations({ locale: activeLocale, namespace: 'metadata' });
  return {
    title: t('servicesTitle'),
    description: t('servicesDescription'),
    alternates: {
      languages: {
        'en-IN': '/en/services',
        'mr-IN': '/mr/services',
      },
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale = hasLocale(routing.locales, locale) ? locale : 'en';
  setRequestLocale(activeLocale);

  const t = await getTranslations('servicesPage');
  const common = await getTranslations('common');

  const pillars = t.raw('pillars') as Array<{
    slug: string;
    anchor: string;
    title: string;
    tagline: string;
    whoFor: string;
    included: string[];
    cadence: string;
  }>;

  const iconMap = {
    'mutual-funds': {
      Icon: TrendUp,
      bg: 'bg-[var(--color-growth-soft)]',
      fg: 'text-[var(--color-growth-text)]',
    },
    'financial-planning': {
      Icon: Compass,
      bg: 'bg-[var(--color-primary-soft)]',
      fg: 'text-[var(--color-primary)]',
    },
    insurance: {
      Icon: ShieldCheck,
      bg: 'bg-[var(--color-growth-soft)]',
      fg: 'text-[var(--color-growth-text)]',
    },
    'tax-portfolio': {
      Icon: Calculator,
      bg: 'bg-[var(--color-primary-soft)]',
      fg: 'text-[var(--color-primary)]',
    },
  } as const;

  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-card)] py-12 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            {t('eyebrow')}
          </p>
          <h1 className="heading-balance mt-2 max-w-[24ch] text-3xl font-bold text-[var(--color-secondary)] sm:text-4xl">
            {t('heading')}
          </h1>
          <p className="mt-3 max-w-[65ch] text-base text-[var(--color-muted-foreground)] sm:text-lg">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Wrap-safe Jump Sub-Navigation */}
      <nav
        aria-label={t('jumpLabel')}
        className="border-b border-[var(--color-border)] bg-[var(--color-background)] md:sticky md:top-[76px] md:z-30"
      >
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-2 px-4 py-3 sm:px-6">
          {pillars.map((pillar) => (
            <a
              key={pillar.anchor}
              href={`#${pillar.anchor}`}
              className="inline-flex min-h-[40px] items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3.5 py-1.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              {pillar.title}
            </a>
          ))}
          <Link
            href="/calculators"
            className="inline-flex min-h-[40px] items-center rounded-lg border border-[var(--color-growth-text)]/30 bg-[var(--color-growth-soft)] px-3.5 py-1.5 text-sm font-semibold text-[var(--color-growth-pill-text)] transition-colors hover:bg-[#DCF1D9]"
          >
            {t('jumpCalculator')}
          </Link>
        </div>
      </nav>

      {/* Alternating Detailed Service Sections */}
      <div>
        {pillars.map((pillar, index) => {
          const visual =
            iconMap[pillar.slug as keyof typeof iconMap] ??
            iconMap['mutual-funds'];
          const Icon = visual.Icon;
          const isAlt = index % 2 === 1;

          return (
            <section
              key={pillar.slug}
              id={pillar.anchor}
              className={`anchor-offset border-b border-[var(--color-border)] py-12 sm:py-16 ${
                isAlt ? 'bg-[var(--color-background)]' : 'bg-[var(--color-card)]'
              }`}
            >
              <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12">
                <div className="bilingual-flow lg:col-span-5">
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${visual.bg} ${visual.fg}`}
                  >
                    <Icon size={24} weight="regular" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-[var(--color-secondary)] sm:text-3xl">
                    {pillar.title}
                  </h2>
                  <p className="mt-2.5 text-base text-[var(--color-muted-foreground)]">
                    {pillar.tagline}
                  </p>

                  <div className="mt-6">
                    <Button asChild size="default">
                      <Link href={`/consultation?topic=${pillar.slug}`}>
                        <span>{common('bookThisService')}</span>
                        <ArrowRight
                          size={16}
                          weight="bold"
                          className="transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <Card className="bilingual-flow p-6 sm:p-7">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                        {t('whoForLabel')}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-foreground)] sm:text-base">
                        {pillar.whoFor}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-[var(--color-border)] pt-5">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                        {t('includedLabel')}
                      </h3>
                      <ul className="mt-3 flex flex-col gap-2.5">
                        {pillar.included.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-sm text-[var(--color-foreground)]"
                          >
                            <Check
                              size={16}
                              weight="bold"
                              className="mt-1 shrink-0 text-[var(--color-growth-text)]"
                              aria-hidden="true"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 rounded-lg bg-[var(--color-muted)] px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                        {t('cadenceLabel')}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                        {pillar.cadence}
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <ConsultationBanner />
    </>
  );
}
