import { Phone, WhatsappLogo, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { ADVISER_CONFIG, getWhatsAppHref } from '@/lib/compliance';
import { BrandLogo } from './BrandLogo';

export async function Footer() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations('footer');
  const brand = await getTranslations('brand');
  const nav = await getTranslations('nav');
  const homeServices = await getTranslations('home.services');
  const currentYear = new Date().getFullYear();

  const serviceCards = homeServices.raw('cards') as Array<{
    anchor: string;
    title: string;
  }>;

  return (
    <footer className="bg-[var(--color-primary)] text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="bilingual-flow lg:col-span-4">
            <BrandLogo
              brandName={brand('name')}
              adviserName={brand('adviser')}
              variant="dark"
              size="footer"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-on-brand-muted)]">
              {t('description')}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={ADVISER_CONFIG.phoneHref}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                <Phone size={18} weight="regular" aria-hidden="true" />
                <span className="numeric-tabular">{ADVISER_CONFIG.phoneDisplay}</span>
              </a>
              <a
                href={getWhatsAppHref(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[var(--color-gold-brand)] px-3.5 py-2 text-sm font-semibold text-[var(--color-secondary)] transition-colors hover:bg-[#D99B10]"
              >
                <WhatsappLogo size={18} weight="regular" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-gold-on-brand)]">
              {t('quickLinksTitle')}
            </h2>
            <ul className="mt-4 flex flex-col gap-1.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="inline-flex min-h-[36px] items-center text-[var(--color-on-brand-muted)] transition-colors hover:text-white"
                >
                  {nav('home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="inline-flex min-h-[36px] items-center text-[var(--color-on-brand-muted)] transition-colors hover:text-white"
                >
                  {nav('services')}
                </Link>
              </li>
              <li>
                <Link
                  href="/calculators"
                  className="inline-flex min-h-[36px] items-center text-[var(--color-on-brand-muted)] transition-colors hover:text-white"
                >
                  {nav('calculators')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="inline-flex min-h-[36px] items-center text-[var(--color-on-brand-muted)] transition-colors hover:text-white"
                >
                  {nav('about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/consultation"
                  className="inline-flex min-h-[36px] items-center text-[var(--color-on-brand-muted)] transition-colors hover:text-white"
                >
                  {nav('bookConsultation')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-gold-on-brand)]">
              {t('servicesTitle')}
            </h2>
            <ul className="mt-4 flex flex-col gap-1.5 text-sm">
              {serviceCards.map((service) => (
                <li key={service.anchor}>
                  <Link
                    href={`/services#${service.anchor}`}
                    className="inline-flex min-h-[36px] items-center text-[var(--color-on-brand-muted)] transition-colors hover:text-white"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bilingual-flow lg:col-span-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-gold-on-brand)]">
              {t('contactTitle')}
            </h2>
            <dl className="mt-4 flex flex-col gap-2 text-sm text-[var(--color-on-brand-muted)]">
              <div>
                <dt className="sr-only">Office</dt>
                <dd>
                  {locale === 'mr'
                    ? ADVISER_CONFIG.officeCityMr
                    : ADVISER_CONFIG.officeCityEn}
                </dd>
              </div>
              <div>
                <dt className="sr-only">Hours</dt>
                <dd>
                  {locale === 'mr'
                    ? ADVISER_CONFIG.officeHoursMr
                    : ADVISER_CONFIG.officeHoursEn}
                </dd>
              </div>
              <div>
                <dt className="sr-only">AMFI Registration</dt>
                <dd className="text-xs text-white/85">
                  AMFI: {ADVISER_CONFIG.amfiArnPlaceholder}
                </dd>
              </div>
              <div>
                <dt className="sr-only">IRDAI</dt>
                <dd className="text-xs text-white/85">
                  IRDAI: {ADVISER_CONFIG.irdaiLicensePlaceholder}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/20 bg-[#08236B] p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold-on-brand)]">
            {t('regulatoryTitle')}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-on-brand-muted)]">
            {t('riskDisclaimer')} {t('insuranceDisclaimer')}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-white">
            <Link href="/disclosures" className="underline underline-offset-4 hover:text-[var(--color-gold-on-brand)]">
              {t('disclosuresLink')}
            </Link>
            <Link href="/privacy" className="underline underline-offset-4 hover:text-[var(--color-gold-on-brand)]">
              {t('privacyLink')}
            </Link>
            <a
              href={ADVISER_CONFIG.sebiScoresUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-[var(--color-gold-on-brand)]"
            >
              <span>SEBI SCORES</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a
              href={ADVISER_CONFIG.smartOdrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-[var(--color-gold-on-brand)]"
            >
              <span>SMART ODR</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-2 border-t border-white/15 pt-5 text-xs text-[var(--color-on-brand-muted)] sm:flex-row sm:items-center">
          <p>{t('copyright', { year: currentYear })}</p>
          <p className="numeric-tabular">{ADVISER_CONFIG.phoneDisplay}</p>
        </div>
      </div>
    </footer>
  );
}
