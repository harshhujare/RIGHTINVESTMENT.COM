import { getTranslations } from 'next-intl/server';
import { StaggerReveal } from '@/components/motion/StaggerReveal';
import { Card } from '@/components/ui/Card';

export async function AdvisoryProcess() {
  const t = await getTranslations('home.process');
  const steps = t.raw('steps') as Array<{
    number: string;
    title: string;
    description: string;
  }>;

  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-card)] py-14 sm:py-16 lg:py-20">
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

        <StaggerReveal
          connectorSelector="[data-process-connector]"
          className="relative mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          <div
            aria-hidden="true"
            data-process-connector
            className="pointer-events-none absolute top-[44px] right-[16%] left-[16%] hidden h-[2px] bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/45 to-[var(--color-growth-brand)] md:block"
          />
          {steps.map((step) => (
            <Card
              key={step.number}
              data-stagger-item
              className="bilingual-flow relative z-10 flex flex-col bg-[var(--color-background)] p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-md)]"
            >
              <span className="numeric-tabular inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-bold text-white shadow-xs">
                {step.number}
              </span>
              <h3 className="mt-4 text-lg font-bold text-[var(--color-secondary)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                {step.description}
              </p>
            </Card>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
