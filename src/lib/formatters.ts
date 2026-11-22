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

export interface SipYearlyRow {
  year: number;
  invested: number;
  estimatedValue: number;
  wealthGain: number;
}

export interface SipProjection {
  totalInvested: number;
  estimatedValue: number;
  wealthGain: number;
  yearlyRows: SipYearlyRow[];
}

export function calculateSipProjection(
  monthlySip: number,
  annualRatePercent: number,
  years: number,
): SipProjection {
  const safeMonthly = Math.max(500, Math.min(500000, monthlySip));
  const safeRate = Math.max(0, Math.min(25, annualRatePercent));
  const safeYears = Math.max(1, Math.min(40, Math.round(years)));
  const monthlyRate = safeRate / 12 / 100;

  const yearlyRows: SipYearlyRow[] = [];
  for (let yr = 1; yr <= safeYears; yr += 1) {
    const months = yr * 12;
    const invested = safeMonthly * months;
    let estimatedValue = invested;
    if (monthlyRate > 0) {
      estimatedValue =
        safeMonthly *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate);
    }
    const roundedValue = Math.round(estimatedValue);
    yearlyRows.push({
      year: yr,
      invested: Math.round(invested),
      estimatedValue: roundedValue,
      wealthGain: Math.max(0, roundedValue - Math.round(invested)),
    });
  }

  const last = yearlyRows[yearlyRows.length - 1] ?? {
    invested: 0,
    estimatedValue: 0,
    wealthGain: 0,
  };

  return {
    totalInvested: last.invested,
    estimatedValue: last.estimatedValue,
    wealthGain: last.wealthGain,
    yearlyRows,
  };
}
