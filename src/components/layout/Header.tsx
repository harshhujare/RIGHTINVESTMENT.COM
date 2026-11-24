'use client';

import * as React from 'react';
import { List, Phone } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { ADVISER_CONFIG } from '@/lib/compliance';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import { BrandLogo } from './BrandLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ScrollProgressBar } from '@/components/motion/ScrollProgressBar';

export function Header() {
  const t = useTranslations('nav');
  const brand = useTranslations('brand');
  const common = useTranslations('common');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/services', label: t('services') },
    { href: '/calculators', label: t('calculators') },
    { href: '/about', label: t('about') },
    { href: '/disclosures', label: t('disclosures') },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-card)]/95 backdrop-blur-sm transition-shadow duration-200',
        scrolled && 'shadow-[var(--shadow-sm)]',
      )}
    >
      <div className="mx-auto flex min-h-[76px] max-w-[1200px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center rounded-lg py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
        >
          <BrandLogo
            brandName={brand('name')}
            adviserName={brand('adviser')}
            variant="light"
            size="header"
            priority
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'inline-flex min-h-[44px] items-center rounded-lg px-3.5 py-2 text-[15px] font-medium transition-colors duration-150',
                isActive(item.href)
                  ? 'bg-[var(--color-primary-soft)] font-semibold text-[var(--color-primary)]'
                  : 'text-[var(--color-foreground)] hover:bg-[var(--color-muted)]',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <React.Suspense fallback={<div className="h-[44px] w-[132px]" />}>
            <LanguageSwitcher />
          </React.Suspense>
          <Button asChild size="default">
            <Link href="/consultation">{t('bookConsultation')}</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <React.Suspense fallback={<div className="h-[44px] w-[112px]" />}>
            <LanguageSwitcher />
          </React.Suspense>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={t('openMenu')}
                aria-expanded={mobileOpen}
                className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)]"
              >
                <List size={22} weight="regular" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent title={t('menuTitle')} closeLabel={t('closeMenu')}>
              <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'flex min-h-[48px] items-center rounded-lg px-4 py-3 text-base font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-[var(--color-primary-soft)] font-semibold text-[var(--color-primary)]'
                        : 'text-[var(--color-foreground)] hover:bg-[var(--color-muted)]',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6">
                <Button
                  asChild
                  size="lg"
                  className="w-full"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href="/consultation">{t('bookConsultation')}</Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="w-full">
                  <a href={ADVISER_CONFIG.phoneHref}>
                    <Phone size={18} weight="regular" aria-hidden="true" />
                    <span>{common('callNow')}</span>
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <ScrollProgressBar />
    </header>
  );
}
