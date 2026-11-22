import { ArrowRight, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { getWhatsAppHref } from '@/lib/compliance';
import { Button } from '@/components/ui/Button';

export async function ConsultationBanner() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations('home.banner');

  return (
    <section className="border-t border-white/10 bg-[#08236B] py-14 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-8 rounded-2xl border border-white/15 bg-[var(--color-primary)] p-7 sm:p-10 lg:flex-row lg:items-center">
          <div className="bilingual-flow max-w-[60ch]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold-on-brand)]">
              {t('eyebrow')}
            </p>
            <h2 className="heading-balance mt-2 text-2xl font-bold text-white sm:text-3xl">
              {t('heading')}
            </h2>
            <p className="mt-3 text-base text-[var(--color-on-brand-muted)]">
              {t('description')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button asChild variant="gold" size="lg">
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
            <Button asChild variant="outlineLight" size="lg">
              <a
                href={getWhatsAppHref(locale)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappLogo size={20} weight="regular" aria-hidden="true" />
                <span className="numeric-tabular">{t('secondaryCta')}</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
