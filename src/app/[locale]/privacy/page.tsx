import type { Metadata } from 'next';
import { LockKey } from '@phosphor-icons/react/dist/ssr';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
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
    title: t('privacyTitle'),
    description: t('privacyDescription'),
    alternates: {
      languages: {
        'en-IN': '/en/privacy',
        'mr-IN': '/mr/privacy',
      },
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale = hasLocale(routing.locales, locale) ? locale : 'en';
  setRequestLocale(activeLocale);

  const t = await getTranslations('privacyPage');
  const sections = t.raw('sections') as Array<{
    title: string;
    body: string;
  }>;

  return (
    <section className="bg-[var(--color-background)] py-12 sm:py-16">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6">
        <Badge variant="primary" className="mb-3">
          <LockKey size={16} weight="regular" aria-hidden="true" />
          <span>{t('eyebrow')}</span>
        </Badge>
        <h1 className="heading-balance text-3xl font-bold text-[var(--color-secondary)] sm:text-4xl">
          {t('heading')}
        </h1>
        <p className="mt-3 max-w-prose text-base text-[var(--color-muted-foreground)]">
          {t('subtitle')}
        </p>

        <div className="mt-8 flex flex-col gap-5">
          {sections.map((section) => (
            <Card key={section.title} className="bilingual-flow p-6">
              <h2 className="text-lg font-bold text-[var(--color-secondary)]">
                {section.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-foreground)] sm:text-base">
                {section.body}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
