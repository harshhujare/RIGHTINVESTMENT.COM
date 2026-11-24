import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle,
  Phone,
} from '@phosphor-icons/react/dist/ssr';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { ADVISER_CONFIG } from '@/lib/compliance';
import { HeroMotion } from '@/components/motion/HeroMotion';
import { TypingText } from '@/components/motion/TypingText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export async function HeroSection() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations('home.hero');
  const focusItems = t.raw('spotlight.focusItems') as string[];
  const typingPhrases = t.raw('typingPhrases') as string[];

  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-card)]">
      <HeroMotion className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-12 lg:gap-12 lg:py-12">
        <div className="bilingual-flow lg:col-span-7">
          <h1
            data-hero-item
            className="heading-balance max-w-[22ch] text-3xl font-bold text-[var(--color-secondary)] sm:text-4xl lg:text-[44px]"
          >
            {t('headline')}
          </h1>

          <div data-hero-item className="mt-3">
            <TypingText
              prefix={t('typingPrefix')}
              phrases={typingPhrases}
              locale={locale}
            />
          </div>

          <p
            data-hero-item
            className="mt-3 max-w-[62ch] text-base text-[var(--color-muted-foreground)] sm:text-lg"
          >
            {t('subheadline')}
          </p>

          <div data-hero-item className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/consultation">
                <span>{t('primaryCta')}</span>
                <ArrowRight
                  size={18}
                  weight="bold"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/services">{t('secondaryCta')}</Link>
            </Button>
          </div>

          <div
            data-hero-item
            className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--color-muted-foreground)]"
          >
            <span>{t('directLine')}</span>
            <a
              href={ADVISER_CONFIG.phoneHref}
              className="numeric-tabular inline-flex min-h-[36px] items-center gap-1.5 font-semibold text-[var(--color-primary)] underline decoration-[var(--color-primary)]/40 underline-offset-4 hover:decoration-[var(--color-primary)]"
            >
              <Phone size={16} weight="regular" aria-hidden="true" />
              <span>{ADVISER_CONFIG.phoneDisplay}</span>
            </a>
          </div>
        </div>

        <div data-hero-item className="lg:col-span-5">
          <Card className="overflow-hidden border-[var(--color-border)] bg-[var(--color-background)] p-4 sm:p-5 shadow-[var(--shadow-md)] transition-shadow duration-200 hover:shadow-[var(--shadow-lg)]">
            <div className="relative mx-auto aspect-[4/4.3] w-full max-w-[380px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] lg:max-w-none">
              <Image
                src="/images/sachin-jagtap.webp"
                alt={t('spotlight.portraitAlt')}
                fill
                priority
                sizes="(max-width: 1024px) 380px, 460px"
                className="object-cover object-[50%_15%]"
              />
            </div>

            <div className="bilingual-flow mt-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold-text)]">
                  {t('spotlight.eyebrow')}
                </p>
                <h2 className="mt-0.5 text-xl font-bold text-[var(--color-secondary)]">
                  {t('spotlight.name')}
                </h2>
                <p className="mt-0.5 text-sm text-[var(--color-muted-foreground)]">
                  {t('spotlight.role')}
                </p>
              </div>
              <Badge variant="growth">{t('spotlight.bilingualPill')}</Badge>
            </div>

            <div className="mt-4 border-t border-[var(--color-border)] pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                {t('spotlight.focusHeading')}
              </p>
              <ul className="mt-2.5 flex flex-col gap-2">
                {focusItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-[var(--color-foreground)]"
                  >
                    <CheckCircle
                      size={18}
                      weight="fill"
                      className="mt-0.5 shrink-0 text-[var(--color-growth-text)]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </HeroMotion>
    </section>
  );
}
