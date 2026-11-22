'use client';

import * as React from 'react';
import { ArrowRight, Table } from '@phosphor-icons/react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import {
  calculateSipProjection,
  formatINR,
  formatIndianCompact,
} from '@/lib/formatters';
import { AnimatedINR } from '@/components/motion/AnimatedINR';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function SipGoalIllustrator() {
  const t = useTranslations('sip');
  const locale = useLocale() as AppLocale;

  const [monthlySip, setMonthlySip] = React.useState(15000);
  const [years, setYears] = React.useState(15);
  const [annualRate, setAnnualRate] = React.useState(12);
  const [showTable, setShowTable] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const projection = React.useMemo(
    () => calculateSipProjection(monthlySip, annualRate, years),
    [monthlySip, annualRate, years],
  );

  const chartData = React.useMemo(
    () =>
      projection.yearlyRows.map((row) => ({
        ...row,
        label: `${t('yearAxisPrefix')} ${row.year}`,
      })),
    [projection.yearlyRows, t],
  );

  const handleMonthlyChange = (raw: string) => {
    const parsed = Number(raw);
    if (!Number.isNaN(parsed)) {
      setMonthlySip(Math.max(500, Math.min(200000, parsed)));
    }
  };

  return (
    <section
      id="sip-illustrator"
      className="anchor-offset border-b border-[var(--color-border)] bg-[var(--color-background)] py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="max-w-[65ch]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-growth-text)]">
            {t('eyebrow')}
          </p>
          <h2 className="heading-balance mt-2 text-2xl font-bold text-[var(--color-secondary)] sm:text-3xl">
            {t('heading')}
          </h2>
          <p className="mt-3 text-base text-[var(--color-muted-foreground)]">
            {t('subtitle')}
          </p>
        </div>

        <Card className="mt-8 p-5 sm:p-8 shadow-[var(--shadow-md)]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Controls Column */}
            <div className="flex flex-col justify-between gap-6 lg:col-span-5">
              <div className="flex flex-col gap-6">
                {/* Monthly SIP */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor="sip-monthly-range"
                      className="text-sm font-semibold text-[var(--color-foreground)]"
                    >
                      {t('monthlyLabel')}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-[var(--color-muted-foreground)]">
                        ₹
                      </span>
                      <input
                        aria-label={t('monthlyLabel')}
                        type="number"
                        min={500}
                        max={200000}
                        step={500}
                        value={monthlySip}
                        onChange={(e) => handleMonthlyChange(e.target.value)}
                        className="numeric-tabular min-h-[40px] w-28 rounded-lg border-[1.5px] border-[var(--color-border-input)] bg-[var(--color-card)] px-2.5 py-1 text-right text-sm font-bold text-[var(--color-primary)]"
                      />
                    </div>
                  </div>
                  <input
                    id="sip-monthly-range"
                    type="range"
                    min={1000}
                    max={100000}
                    step={500}
                    value={Math.min(100000, monthlySip)}
                    onChange={(e) => setMonthlySip(Number(e.target.value))}
                    className="mt-3 h-2 w-full cursor-pointer accent-[var(--color-primary)]"
                  />
                  <div className="numeric-tabular mt-1 flex justify-between text-xs text-[var(--color-muted-foreground)]">
                    <span>₹1,000</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>

                {/* Horizon Years */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor="sip-years-range"
                      className="text-sm font-semibold text-[var(--color-foreground)]"
                    >
                      {t('yearsLabel')}
                    </label>
                    <span className="numeric-tabular rounded-md bg-[var(--color-primary-soft)] px-2.5 py-1 text-sm font-bold text-[var(--color-primary)]">
                      {years} {t('yearsUnit')}
                    </span>
                  </div>
                  <input
                    id="sip-years-range"
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="mt-3 h-2 w-full cursor-pointer accent-[var(--color-primary)]"
                  />
                  <div className="numeric-tabular mt-1 flex justify-between text-xs text-[var(--color-muted-foreground)]">
                    <span>1 {t('yearsUnit')}</span>
                    <span>30 {t('yearsUnit')}</span>
                  </div>
                </div>

                {/* Illustrative Annual Rate */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor="sip-rate-range"
                      className="text-sm font-semibold text-[var(--color-foreground)]"
                    >
                      {t('rateLabel')}
                    </label>
                    <span className="numeric-tabular rounded-md bg-[var(--color-growth-soft)] px-2.5 py-1 text-sm font-bold text-[var(--color-growth-pill-text)]">
                      {annualRate}%
                    </span>
                  </div>
                  <input
                    id="sip-rate-range"
                    type="range"
                    min={6}
                    max={15}
                    step={0.5}
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value))}
                    className="mt-3 h-2 w-full cursor-pointer accent-[var(--color-growth-text)]"
                  />
                  <p className="mt-1.5 text-xs text-[var(--color-muted-foreground)]">
                    {t('rateNote')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link
                    href={`/consultation?topic=mutual-funds&sip=${monthlySip}&years=${years}`}
                  >
                    <span>{t('ctaButton')}</span>
                    <ArrowRight
                      size={17}
                      weight="bold"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Results & Accessible Chart Column */}
            <div className="bilingual-flow flex flex-col gap-5 lg:col-span-7">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
                  <p className="text-xs font-medium text-[var(--color-muted-foreground)]">
                    {t('totalInvestedLabel')}
                  </p>
                  <p className="mt-1 text-lg font-bold text-[var(--color-primary)]">
                    <AnimatedINR
                      value={projection.totalInvested}
                      format="full"
                      locale={locale}
                    />
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-growth-soft)]/70 p-4">
                  <p className="text-xs font-medium text-[var(--color-growth-pill-text)]">
                    {t('estimatedGainLabel')}
                  </p>
                  <p className="mt-1 text-lg font-bold text-[var(--color-growth-pill-text)]">
                    <AnimatedINR
                      value={projection.wealthGain}
                      format="full"
                      locale={locale}
                    />
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary-soft)] p-4">
                  <p className="text-xs font-semibold text-[var(--color-primary)]">
                    {t('estimatedTotalLabel')}
                  </p>
                  <p className="mt-1 text-xl font-bold text-[var(--color-secondary)]">
                    <AnimatedINR
                      value={projection.estimatedValue}
                      format="compact"
                      locale={locale}
                    />
                  </p>
                </div>
              </div>

              {/* Screen-reader live summary (polite, never steals focus) */}
              <p className="sr-only" aria-live="polite" aria-atomic="true">
                {t('liveSummary', {
                  monthly: formatINR(monthlySip),
                  years,
                  rate: annualRate,
                  invested: formatINR(projection.totalInvested),
                  value: formatINR(projection.estimatedValue),
                })}
              </p>

              {/* Accessible Legend near chart */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--color-foreground)]">
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="inline-block h-0.5 w-6 bg-[#0B2E8A]"
                    />
                    <span>{t('chartLegendInvested')}</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="inline-block h-0.5 w-6 border-t-2 border-dashed border-[#38982B]"
                    />
                    <span>{t('chartLegendValue')}</span>
                  </span>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-expanded={showTable}
                  aria-controls="sip-yearly-table"
                  onClick={() => setShowTable((prev) => !prev)}
                  className="border border-[var(--color-border)] text-xs font-semibold"
                >
                  <Table size={16} weight="regular" aria-hidden="true" />
                  <span>{showTable ? t('hideTable') : t('showTable')}</span>
                </Button>
              </div>

              {/* Chart Container with explicit reserved height for zero CLS */}
              <div
                className="h-[280px] w-full rounded-xl border border-[var(--color-border)] bg-white p-3"
                role="img"
                aria-label={t('liveSummary', {
                  monthly: formatINR(monthlySip),
                  years,
                  rate: annualRate,
                  invested: formatINR(projection.totalInvested),
                  value: formatINR(projection.estimatedValue),
                })}
              >
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 12, left: 4, bottom: 0 }}
                    >
                      <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 12, fill: '#475569' }}
                        tickFormatter={(val) => `${t('yearAxisPrefix')} ${val}`}
                        minTickGap={24}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#475569' }}
                        width={76}
                        tickFormatter={(val) =>
                          formatIndianCompact(Number(val), locale)
                        }
                      />
                      <Tooltip
                        formatter={(value, name) => [
                          formatINR(Number(value ?? 0)),
                          name === 'invested'
                            ? t('chartLegendInvested')
                            : t('chartLegendValue'),
                        ]}
                        labelFormatter={(label) =>
                          `${t('tableYear')} ${label}`
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="invested"
                        stroke="#0B2E8A"
                        strokeWidth={2.5}
                        fill="#0B2E8A"
                        fillOpacity={0.1}
                        isAnimationActive={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="estimatedValue"
                        stroke="#38982B"
                        strokeWidth={2.5}
                        strokeDasharray="6 4"
                        fill="#38982B"
                        fillOpacity={0.14}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-[var(--color-muted-foreground)]">
                    {formatIndianCompact(projection.estimatedValue, locale)}
                  </div>
                )}
              </div>

              {showTable && (
                <div
                  id="sip-yearly-table"
                  data-lenis-prevent
                  className="animate-subtle-enter max-h-72 overflow-auto rounded-xl border border-[var(--color-border)]"
                >
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="sticky top-0 bg-[var(--color-muted)] text-xs font-semibold text-[var(--color-secondary)]">
                      <tr>
                        <th scope="col" className="px-4 py-2.5">
                          {t('tableYear')}
                        </th>
                        <th scope="col" className="px-4 py-2.5 text-right">
                          {t('tableInvested')}
                        </th>
                        <th scope="col" className="px-4 py-2.5 text-right">
                          {t('tableGain')}
                        </th>
                        <th scope="col" className="px-4 py-2.5 text-right">
                          {t('tableValue')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] bg-white">
                      {projection.yearlyRows.map((row) => (
                        <tr key={row.year}>
                          <td className="numeric-tabular px-4 py-2 font-medium">
                            {row.year}
                          </td>
                          <td className="numeric-tabular px-4 py-2 text-right">
                            {formatINR(row.invested)}
                          </td>
                          <td className="numeric-tabular px-4 py-2 text-right text-[var(--color-growth-text)]">
                            {formatINR(row.wealthGain)}
                          </td>
                          <td className="numeric-tabular px-4 py-2 text-right font-semibold">
                            {formatINR(row.estimatedValue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="rounded-lg bg-[var(--color-muted)] px-4 py-3 text-xs leading-relaxed text-[var(--color-muted-foreground)]">
                {t('disclaimer')}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
