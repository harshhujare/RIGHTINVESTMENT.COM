import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Sans_Devanagari } from 'next/font/google';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider';
import '../globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-latin',
  display: 'swap',
});

const ibmPlexSansDevanagari = IBM_Plex_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-devanagari',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = hasLocale(routing.locales, locale) ? locale : 'en';
  const t = await getTranslations({ locale: activeLocale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rightinvestment.in';

  return {
    metadataBase: new URL(baseUrl),
    title: t('homeTitle'),
    description: t('homeDescription'),
    icons: {
      icon: '/logo.png',
      apple: '/logo.png',
    },
    alternates: {
      languages: {
        'en-IN': '/en',
        'mr-IN': '/mr',
      },
    },
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDescription'),
      images: ['/logo.png'],
      locale: activeLocale === 'mr' ? 'mr_IN' : 'en_IN',
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const nav = await getTranslations({ locale: locale as AppLocale, namespace: 'nav' });

  return (
    <html
      lang={locale}
      className={`${ibmPlexSans.variable} ${ibmPlexSansDevanagari.variable}`}
    >
      <body className="flex min-h-dvh flex-col antialiased">
        <a href="#main-content" className="skip-link">
          {nav('skipToMain')}
        </a>
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <Header />
            <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
            <Footer />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
