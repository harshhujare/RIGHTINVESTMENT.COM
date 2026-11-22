import type { Metadata } from 'next';
import { ArrowUpRight, Scales } from '@phosphor-icons/react/dist/ssr';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ADVISER_CONFIG } from '@/lib/compliance';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = hasLocale(routing.locales, locale) ? locale : 'en';
  const t = await getTranslations({ locale: activeLocale, namespace: 'metadata' });
  return {
    title: t('disclosuresTitle'),
    description: t('disclosuresDescription'),
    alternates: {
      languages: {
        'en-IN': '/en/disclosures',
        'mr-IN': '/mr/disclosures',
      },
    },
  };
}

export default async function DisclosuresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale = hasLocale(routing.locales, locale) ? locale : 'en';
  setRequestLocale(activeLocale);

  const t = await getTranslations('disclosuresPage');

  return (
    <section className="bg-[var(--color-background)] py-12 sm:py-16">
      <div className="mx-auto max-w-[960px] px-4 sm:px-6">
        <Badge variant="primary" className="mb-3">
          <Scales size={16} weight="regular" aria-hidden="true" />
          <span>{t('eyebrow')}</span>
        </Badge>
        <h1 className="heading-balance text-3xl font-bold text-[var(--color-secondary)] sm:text-4xl">
          {t('heading')}
        </h1>
        <p className="mt-3 max-w-prose text-base text-[var(--color-muted-foreground)]">
          {t('subtitle')}
        </p>

        <div className="mt-8 flex flex-col gap-6">
          <Card className="border-l-4 border-l-[var(--color-primary)] p-6">
            <h2 className="text-lg font-bold text-[var(--color-secondary)]">
              {t('regCardTitle')}
            </h2>
            <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
              {t('regNote')}
            </p>
            <dl className="mt-4 divide-y divide-[var(--color-border)] text-sm">
              <div className="flex flex-col justify-between gap-1 py-2.5 sm:flex-row">
                <dt className="font-medium text-[var(--color-muted-foreground)]">
                  Entity / Adviser
                </dt>
                <dd className="font-semibold text-[var(--color-secondary)]">
                  {ADVISER_CONFIG.brandName} · {ADVISER_CONFIG.adviserName}
                </dd>
              </div>
              <div className="flex flex-col justify-between gap-1 py-2.5 sm:flex-row">
                <dt className="font-medium text-[var(--color-muted-foreground)]">
                  AMFI Registration (ARN)
                </dt>
                <dd className="numeric-tabular font-semibold text-[var(--color-secondary)]">
                  {ADVISER_CONFIG.amfiArnPlaceholder}
                </dd>
              </div>
              <div className="flex flex-col justify-between gap-1 py-2.5 sm:flex-row">
                <dt className="font-medium text-[var(--color-muted-foreground)]">
                  EUIN
                </dt>
                <dd className="numeric-tabular font-semibold text-[var(--color-secondary)]">
                  {ADVISER_CONFIG.euinPlaceholder}
                </dd>
              </div>
              <div className="flex flex-col justify-between gap-1 py-2.5 sm:flex-row">
                <dt className="font-medium text-[var(--color-muted-foreground)]">
                  IRDAI / PoSP
                </dt>
                <dd className="numeric-tabular font-semibold text-[var(--color-secondary)]">
                  {ADVISER_CONFIG.irdaiLicensePlaceholder}
                </dd>
              </div>
              <div className="flex flex-col justify-between gap-1 py-2.5 sm:flex-row">
                <dt className="font-medium text-[var(--color-muted-foreground)]">
                  Contact Phone / WhatsApp
                </dt>
                <dd className="numeric-tabular font-semibold text-[var(--color-primary)]">
                  {ADVISER_CONFIG.phoneDisplay}
                </dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-[var(--color-secondary)]">
              {t('mfHeading')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-foreground)]">
              {t('mfBody')}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-[var(--color-secondary)]">
              {t('insuranceHeading')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-foreground)]">
              {t('insuranceBody')}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-[var(--color-secondary)]">
              {t('grievanceHeading')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-foreground)]">
              {t('grievanceBody')}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={ADVISER_CONFIG.sebiScoresUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]"
              >
                <span>{t('scoresLabel')}</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a
                href={ADVISER_CONFIG.smartOdrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]"
              >
                <span>{t('odrLabel')}</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a
                href={ADVISER_CONFIG.amfiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]"
              >
                <span>{t('amfiLabel')}</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
