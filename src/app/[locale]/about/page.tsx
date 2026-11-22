import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, CheckCircle } from '@phosphor-icons/react/dist/ssr';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AdvisoryProcess } from '@/components/sections/AdvisoryProcess';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
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
    title: t('aboutTitle'),
    description: t('aboutDescription'),
    alternates: {
      languages: {
        'en-IN': '/en/about',
        'mr-IN': '/mr/about',
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale = hasLocale(routing.locales, locale) ? locale : 'en';
  setRequestLocale(activeLocale);

  const t = await getTranslations('aboutPage');
  const nav = await getTranslations('nav');
  const bioParagraphs = t.raw('bioParagraphs') as string[];
  const credentials = t.raw('credentials') as Array<{
    label: string;
    value: string;
  }>;

  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-card)] py-12 sm:py-16">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12">
          {/* 5 Columns: Portrait Frame + Credentials Card */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Card className="overflow-hidden p-3 sm:p-4 shadow-[var(--shadow-md)]">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] lg:max-w-none">
                <Image
                  src="/images/sachin-jagtap.webp"
                  alt={t('portraitAlt')}
                  fill
                  priority
                  sizes="(max-width: 1024px) 420px, 460px"
                  className="object-cover object-[50%_15%]"
                />
              </div>
            </Card>

            <Card className="border-l-4 border-l-[var(--color-primary)] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-bold text-[var(--color-secondary)]">
                  {t('credentialsTitle')}
                </h2>
                <CheckCircle
                  size={20}
                  weight="fill"
                  className="shrink-0 text-[var(--color-growth-text)]"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                {t('credentialsSubtitle')}
              </p>

              <dl className="mt-4 divide-y divide-[var(--color-border)] text-sm">
                {credentials.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col justify-between gap-1 py-2.5 sm:flex-row sm:items-center"
                  >
                    <dt className="font-medium text-[var(--color-muted-foreground)]">
                      {item.label}
                    </dt>
                    <dd className="numeric-tabular font-semibold text-[var(--color-secondary)]">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 border-t border-[var(--color-border)] pt-3">
                <Link
                  href="/disclosures"
                  className="inline-flex min-h-[36px] items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline"
                >
                  <span>{t('viewDisclosuresLink')}</span>
                  <ArrowRight size={15} weight="bold" aria-hidden="true" />
                </Link>
              </div>
            </Card>
          </div>

          {/* 7 Columns: Adviser Narrative */}
          <div className="bilingual-flow lg:col-span-7">
            <Badge variant="primary" className="mb-3">
              {t('eyebrow')}
            </Badge>
            <h1 className="heading-balance max-w-[24ch] text-3xl font-bold text-[var(--color-secondary)] sm:text-4xl">
              {t('heading')}
            </h1>
            <p className="mt-4 max-w-prose text-lg font-medium text-[var(--color-primary)]">
              {t('intro')}
            </p>

            <div className="mt-6 flex max-w-prose flex-col gap-5 text-base text-[var(--color-foreground)]">
              {bioParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/consultation">
                  <span>{nav('bookConsultation')}</span>
                  <ArrowRight
                    size={18}
                    weight="bold"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/services">{nav('services')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <AdvisoryProcess />
      <TestimonialsSection showAboutLink={false} />
      <ConsultationBanner />
    </>
  );
}
