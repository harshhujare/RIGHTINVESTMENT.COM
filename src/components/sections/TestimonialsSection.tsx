import { ArrowRight, Quotes } from '@phosphor-icons/react/dist/ssr';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { StaggerReveal } from '@/components/motion/StaggerReveal';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export async function TestimonialsSection({
  showAboutLink = true,
}: {
  showAboutLink?: boolean;
}) {
  const t = await getTranslations('home.testimonials');
  const items = t.raw('items') as Array<{
    quote: string;
    name: string;
    location: string;
  }>;

  return (
    <section className="bg-[var(--color-card)] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-[65ch]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              {t('eyebrow')}
            </p>
            <h2 className="heading-balance mt-2 text-2xl font-bold text-[var(--color-secondary)] sm:text-3xl">
              {t('heading')}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
              {t('subtitle')}
            </p>
          </div>
          {showAboutLink && (
            <Link
              href="/about"
              className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline"
            >
              <span>{t('viewAboutLink')}</span>
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </Link>
          )}
        </div>

        <StaggerReveal className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item) => (
            <Card
              key={item.name}
              data-stagger-item
              className="bilingual-flow flex flex-col justify-between bg-[var(--color-background)] p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-md)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Quotes
                    size={24}
                    weight="fill"
                    className="text-[var(--color-primary)]/40"
                    aria-hidden="true"
                  />
                  <Badge variant="gold">{t('placeholderTag')}</Badge>
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-[var(--color-foreground)]">
                  “{item.quote}”
                </blockquote>
              </div>

              <div className="mt-5 border-t border-[var(--color-border)] pt-3">
                <p className="text-sm font-semibold text-[var(--color-secondary)]">
                  {item.name}
                </p>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  {item.location}
                </p>
              </div>
            </Card>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
