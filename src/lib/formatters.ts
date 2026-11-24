import type { AppLocale } from '@/i18n/routing';

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  if (!Number.isFinite(amount)) return '₹0';
  return inrFormatter.format(Math.round(amount));
}

export function formatIndianCompact(amount: number, locale: AppLocale): string {
  if (!Number.isFinite(amount)) return '₹0';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1_00_00_000) {
    const cr = (abs / 1_00_00_000).toFixed(2);
    return locale === 'mr' ? `${sign}₹${cr} कोटी` : `${sign}₹${cr} Cr`;
  }
  if (abs >= 1_00_000) {
    const lakh = (abs / 1_00_000).toFixed(2);
    return locale === 'mr' ? `${sign}₹${lakh} लाख` : `${sign}₹${lakh} Lakh`;
  }
  return formatINR(amount);
}
