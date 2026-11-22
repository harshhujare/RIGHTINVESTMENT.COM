import {
  ArrowRight,
  Calculator,
  Check,
  Compass,
  ShieldCheck,
  TrendUp,
} from '@phosphor-icons/react/dist/ssr';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { StaggerReveal } from '@/components/motion/StaggerReveal';
import { Card } from '@/components/ui/Card';

export async function ServicesOverview() {
  const t = await getTranslations('home.services');
  const common = await getTranslations('common');

  const cards = t.raw('cards') as Array<{
    slug: string;
    anchor: string;
    title: string;
    summary: string;
    points: string[];
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
    <section className="bg-[var(--color-background)] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="max-w-[65ch]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            {t('eyebrow')}
          </p>
          <h2 className="heading-balance mt-2 text-2xl font-bold text-[var(--color-secondary)] sm:text-3xl">
            {t('heading')}
          </h2>
          <p className="mt-3 text-base text-[var(--color-muted-foreground)]">
            {t('subtitle')}
          </p>
        </div>

        <StaggerReveal className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((card) => {
            const visual =
              iconMap[card.slug as keyof typeof iconMap] ??
              iconMap['mutual-funds'];
            const Icon = visual.Icon;
            return (
              <Card
                key={card.slug}
                data-stagger-item
                className="bilingual-flow flex flex-col justify-between p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-md)]"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <span
                      className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${visual.bg} ${visual.fg}`}
                    >
                      <Icon size={24} weight="regular" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-[var(--color-secondary)]">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                        {card.summary}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-5 flex flex-col gap-2.5 border-t border-[var(--color-border)] pt-4">
                    {card.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm text-[var(--color-foreground)]"
                      >
                        <Check
                          size={16}
                          weight="bold"
                          className="mt-1 shrink-0 text-[var(--color-growth-text)]"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--color-border)] pt-4">
                  <Link
                    href={`/consultation?topic=${card.slug}`}
                    className="group inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
                  >
                    <span>{common('bookThisService')}</span>
                    <ArrowRight
                      size={15}
                      weight="bold"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                  <Link
                    href={`/services#${card.anchor}`}
                    className="inline-flex min-h-[44px] items-center px-2 py-2 text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline"
                  >
                    {common('learnMore')}
                  </Link>
                </div>
              </Card>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
