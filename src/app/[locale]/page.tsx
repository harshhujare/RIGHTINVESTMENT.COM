import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesOverview } from '@/components/sections/ServicesOverview';
import { AdvisoryProcess } from '@/components/sections/AdvisoryProcess';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { ConsultationBanner } from '@/components/sections/ConsultationBanner';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale = hasLocale(routing.locales, locale) ? locale : 'en';
  setRequestLocale(activeLocale);

  return (
    <>
      <HeroSection />
      <ServicesOverview />
      <AdvisoryProcess />
      <TestimonialsSection />
      <ConsultationBanner />
    </>
  );
}
