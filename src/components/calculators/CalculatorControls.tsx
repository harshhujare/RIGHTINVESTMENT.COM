'use client';

import * as React from 'react';
import {
  ArrowCounterClockwise,
  CaretDown,
  Minus,
  Plus,
  Table,
} from '@phosphor-icons/react';
import { ResponsiveContainer } from 'recharts';
import {
  formatCompactINR,
  formatINR,
  type StepUpConfig,
  type StepUpMode,
} from '@/lib/calculators';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface AmountFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  sliderMin?: number;
  sliderMax?: number;
  maxAllowed?: number;
  minAllowed?: number;
  step?: number;
  helperText?: string;
}

export function AmountField({
  id,
  label,
  value,
  onChange,
  sliderMin = 0,
  sliderMax = 10000000,
  maxAllowed = 500000000,
  minAllowed = 0,
  step = 10000,
  helperText,
}: AmountFieldProps) {
  const [focused, setFocused] = React.useState(false);
  const [draft, setDraft] = React.useState(String(value));

  React.useEffect(() => {
    if (!focused) {
      setDraft(String(value));
    }
  }, [value, focused]);

  const commitDraft = (raw: string) => {
    const cleaned = raw.replace(/[^\d.]/g, '');
    const parsed = Number(cleaned);
    if (cleaned === '' || Number.isNaN(parsed)) {
      onChange(minAllowed);
      setDraft(String(minAllowed));
      return;
    }
    const clamped = Math.min(maxAllowed, Math.max(minAllowed, Math.round(parsed)));
    onChange(clamped);
    setDraft(String(clamped));
  };

  const handleStep = (delta: number) => {
    const next = Math.min(maxAllowed, Math.max(minAllowed, value + delta));
    onChange(next);
  };

  const formattedDisplay = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(value));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="text-sm font-semibold text-[var(--color-foreground)]"
        >
          {label}
        </label>
        <span className="numeric-tabular rounded-md bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--color-primary)]">
          {formatCompactINR(value)}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => handleStep(-step)}
          aria-label={`Decrease ${label}`}
          className="inline-flex min-h-[44px] min-w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-[var(--color-border-input)] bg-[var(--color-card)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
        >
          <Minus size={16} weight="bold" aria-hidden="true" />
        </button>

        <div className="relative flex-1">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--color-muted-foreground)]"
          >
            ₹
          </span>
          <input
            id={id}
            type="text"
            inputMode="numeric"
            value={focused ? draft : formattedDisplay}
            onFocus={() => {
              setFocused(true);
              setDraft(String(Math.round(value)));
            }}
            onChange={(e) => {
              const raw = e.target.value;
              setDraft(raw);
              const cleaned = raw.replace(/[^\d]/g, '');
              if (cleaned !== '') {
                const parsed = Number(cleaned);
                if (!Number.isNaN(parsed)) {
                  onChange(Math.min(maxAllowed, Math.max(minAllowed, parsed)));
                }
              }
            }}
            onBlur={() => {
              setFocused(false);
              commitDraft(draft);
            }}
            className="numeric-tabular min-h-[44px] w-full rounded-lg border-[1.5px] border-[var(--color-border-input)] bg-[var(--color-card)] pl-7 pr-3 py-2 text-right text-base font-bold text-[var(--color-secondary)] transition-colors focus-visible:border-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          />
        </div>

        <button
          type="button"
          onClick={() => handleStep(step)}
          aria-label={`Increase ${label}`}
          className="inline-flex min-h-[44px] min-w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-[var(--color-border-input)] bg-[var(--color-card)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
        >
          <Plus size={16} weight="bold" aria-hidden="true" />
        </button>
      </div>

      <input
        aria-label={`${label} slider`}
        type="range"
        min={sliderMin}
        max={sliderMax}
        step={step}
        value={Math.min(sliderMax, Math.max(sliderMin, value))}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-0.5 h-2 w-full cursor-pointer accent-[var(--color-primary)]"
      />

      <div className="numeric-tabular flex justify-between text-xs text-[var(--color-muted-foreground)]">
        <span>{formatCompactINR(sliderMin)}</span>
        <span>{formatCompactINR(sliderMax)}</span>
      </div>

      {helperText && (
        <p className="text-xs text-[var(--color-muted-foreground)]">{helperText}</p>
      )}
    </div>
  );
}

interface SliderFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  accent?: 'primary' | 'growth';
  helperText?: string;
}

export function SliderField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  accent = 'primary',
  helperText,
}: SliderFieldProps) {
  const [focused, setFocused] = React.useState(false);
  const [draft, setDraft] = React.useState(String(value));

  React.useEffect(() => {
    if (!focused) {
      setDraft(String(value));
    }
  }, [value, focused]);

  const commitDraft = (raw: string) => {
    const parsed = Number(raw);
    if (raw.trim() === '' || Number.isNaN(parsed)) {
      onChange(min);
      setDraft(String(min));
      return;
    }
    const clamped = Math.min(max, Math.max(min, parsed));
    onChange(clamped);
    setDraft(String(clamped));
  };

  const handleStep = (delta: number) => {
    const rawNext = value + delta;
    const rounded = step < 1 ? Math.round(rawNext * 100) / 100 : Math.round(rawNext);
    onChange(Math.min(max, Math.max(min, rounded)));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="text-sm font-semibold text-[var(--color-foreground)]"
        >
          {label}
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleStep(-step)}
            aria-label={`Decrease ${label}`}
            className="inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-md border border-[var(--color-border-input)] bg-[var(--color-card)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)]"
          >
            <Minus size={14} weight="bold" aria-hidden="true" />
          </button>

          <div className="relative flex items-center">
            <input
              id={id}
              type="number"
              min={min}
              max={max}
              step={step}
              value={focused ? draft : value}
              onFocus={() => {
                setFocused(true);
                setDraft(String(value));
              }}
              onChange={(e) => {
                const raw = e.target.value;
                setDraft(raw);
                const parsed = Number(raw);
                if (raw.trim() !== '' && !Number.isNaN(parsed)) {
                  if (parsed >= min && parsed <= max) {
                    onChange(parsed);
                  }
                }
              }}
              onBlur={() => {
                setFocused(false);
                commitDraft(draft);
              }}
              className={cn(
                'numeric-tabular min-h-[36px] w-20 rounded-md border-[1.5px] border-[var(--color-border-input)] bg-[var(--color-card)] px-2 py-1 text-right text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-ring)]',
                accent === 'growth'
                  ? 'text-[var(--color-growth-text)]'
                  : 'text-[var(--color-primary)]',
              )}
            />
            <span className="ml-1.5 text-xs font-semibold text-[var(--color-muted-foreground)]">
              {unit}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleStep(step)}
            aria-label={`Increase ${label}`}
            className="inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-md border border-[var(--color-border-input)] bg-[var(--color-card)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)]"
          >
            <Plus size={14} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </div>

      <input
        aria-label={`${label} slider`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'h-2 w-full cursor-pointer',
          accent === 'growth'
            ? 'accent-[var(--color-growth-text)]'
            : 'accent-[var(--color-primary)]',
        )}
      />

      <div className="numeric-tabular flex justify-between text-xs text-[var(--color-muted-foreground)]">
        <span>
          {min} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </div>

      {helperText && (
        <p className="text-xs text-[var(--color-muted-foreground)]">{helperText}</p>
      )}
    </div>
  );
}

interface ExpandableSectionProps {
  title: string;
  summary: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function ExpandableSection({
  title,
  summary,
  defaultOpen = false,
  children,
}: ExpandableSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex min-h-[48px] w-full cursor-pointer items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-[var(--color-muted)]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] rounded-xl"
      >
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {title}
          </span>
          <span className="numeric-tabular mt-0.5 text-sm font-semibold text-[var(--color-secondary)]">
            {summary}
          </span>
        </div>
        <CaretDown
          size={18}
          weight="bold"
          aria-hidden="true"
          className={cn(
            'shrink-0 text-[var(--color-primary)] transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div className="border-t border-[var(--color-border)] px-4 py-4">
          {children}
        </div>
      )}
    </div>
  );
}

interface StepUpControlProps {
  value: StepUpConfig;
  onChange: (next: StepUpConfig) => void;
}

const STEP_UP_OPTIONS: Array<{
  mode: StepUpMode;
  label: string;
  defaultVal: number;
  unit: string;
}> = [
  { mode: 'none', label: 'No Step-Up (0%)', defaultVal: 0, unit: '' },
  { mode: 'percentYearly', label: '% Every Year', defaultVal: 10, unit: '%' },
  { mode: 'halfYearlyRupee', label: 'Half-Yearly (₹)', defaultVal: 1000, unit: '₹' },
  { mode: 'yearlyRupee', label: 'Yearly (₹)', defaultVal: 1000, unit: '₹' },
];

export function formatStepUpSummary(stepUp: StepUpConfig): string {
  switch (stepUp.mode) {
    case 'percentYearly':
      return `${stepUp.value}% Every Year`;
    case 'halfYearlyRupee':
      return `+${formatINR(stepUp.value)} Half-Yearly`;
    case 'yearlyRupee':
      return `+${formatINR(stepUp.value)} Yearly`;
    case 'none':
    default:
      return '0% Every Year (Fixed SIP)';
  }
}

export function StepUpControl({ value, onChange }: StepUpControlProps) {
  return (
    <ExpandableSection
      title="Expected Growth in Savings (Step-Up)"
      summary={formatStepUpSummary(value)}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          {STEP_UP_OPTIONS.map((opt) => {
            const active = value.mode === opt.mode;
            return (
              <button
                key={opt.mode}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onChange({
                    mode: opt.mode,
                    value:
                      opt.mode === 'none'
                        ? 0
                        : value.mode === opt.mode
                          ? value.value
                          : opt.defaultVal,
                  })
                }
                className={cn(
                  'min-h-[40px] cursor-pointer rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-ring)]',
                  active
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]',
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {value.mode === 'percentYearly' && (
          <SliderField
            id="stepup-percent"
            label="Annual Step-Up Rate"
            value={value.value}
            onChange={(v) => onChange({ mode: 'percentYearly', value: v })}
            min={0}
            max={25}
            step={1}
            unit="%"
            accent="growth"
          />
        )}

        {(value.mode === 'halfYearlyRupee' || value.mode === 'yearlyRupee') && (
          <AmountField
            id="stepup-rupee"
            label={
              value.mode === 'halfYearlyRupee'
                ? 'Half-Yearly SIP Increase'
                : 'Yearly SIP Increase'
            }
            value={value.value}
            onChange={(v) => onChange({ mode: value.mode, value: v })}
            sliderMin={0}
            sliderMax={25000}
            maxAllowed={500000}
            step={500}
          />
        )}
      </div>
    </ExpandableSection>
  );
}

interface ExistingInvestmentsControlProps {
  amount: number;
  returnRate: number;
  onAmountChange: (val: number) => void;
  onReturnChange: (val: number) => void;
}

export function ExistingInvestmentsControl({
  amount,
  returnRate,
  onAmountChange,
  onReturnChange,
}: ExistingInvestmentsControlProps) {
  const summary =
    amount > 0 ? `${formatINR(amount)} @ ${returnRate}% p.a.` : 'Nil';

  return (
    <ExpandableSection title="Existing Investments" summary={summary}>
      <div className="flex flex-col gap-5">
        <AmountField
          id="existing-amount"
          label="Current Savings Allocated to Goal"
          value={amount}
          onChange={onAmountChange}
          sliderMin={0}
          sliderMax={5000000}
          maxAllowed={200000000}
          step={25000}
        />
        <SliderField
          id="existing-return"
          label="Expected Return on Existing Corpus"
          value={returnRate}
          onChange={onReturnChange}
          min={0}
          max={20}
          step={0.5}
          unit="% p.a."
          accent="growth"
        />
      </div>
    </ExpandableSection>
  );
}

interface KpiCardProps {
  label: string;
  value: string;
  subtext?: string;
  tone?: 'neutral' | 'primary' | 'growth' | 'warning';
  size?: 'hero' | 'large' | 'default';
}

export function KpiCard({
  label,
  value,
  subtext,
  tone = 'neutral',
  size = 'default',
}: KpiCardProps) {
  const toneClasses = {
    neutral: 'border-[var(--color-border)] bg-[var(--color-card)]',
    primary: 'border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)]',
    growth: 'border-[var(--color-growth-text)]/30 bg-[var(--color-growth-soft)]',
    warning: 'border-[var(--color-destructive)]/30 bg-[var(--color-destructive-soft)]',
  }[tone];

  const labelClasses = {
    neutral: 'text-[var(--color-muted-foreground)]',
    primary: 'text-[var(--color-primary)]',
    growth: 'text-[var(--color-growth-pill-text)]',
    warning: 'text-[var(--color-destructive)]',
  }[tone];

  const valueClasses = {
    neutral: 'text-[var(--color-secondary)]',
    primary: 'text-[var(--color-primary)]',
    growth: 'text-[var(--color-growth-pill-text)]',
    warning: 'text-[var(--color-destructive)]',
  }[tone];

  const sizeValueClasses = {
    hero: 'text-3xl sm:text-4xl tracking-tight',
    large: 'text-2xl sm:text-[26px] tracking-tight',
    default: 'text-lg sm:text-xl',
  }[size];

  return (
    <div
      className={cn(
        'rounded-xl border shadow-[var(--shadow-sm)]',
        size === 'hero' ? 'p-5 sm:p-6' : 'p-4 sm:p-5',
        toneClasses,
      )}
    >
      <p
        className={cn(
          'font-semibold',
          size === 'hero' ? 'text-xs sm:text-sm uppercase tracking-wider' : 'text-xs sm:text-sm',
          labelClasses,
        )}
      >
        {label}
      </p>
      <p className={cn('numeric-tabular mt-1.5 font-bold', sizeValueClasses, valueClasses)}>
        {value}
      </p>
      {subtext && (
        <p className="numeric-tabular mt-1.5 text-xs sm:text-sm text-[var(--color-muted-foreground)]">
          {subtext}
        </p>
      )}
    </div>
  );
}

interface ChartContainerProps {
  ariaLabel: string;
  fallbackText: string;
  children: React.ReactElement;
}

export function ChartContainer({
  ariaLabel,
  fallbackText,
  children,
}: ChartContainerProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="h-[300px] w-full rounded-xl border border-[var(--color-border)] bg-white p-3"
      role="img"
      aria-label={ariaLabel}
    >
      {mounted ? (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-medium text-[var(--color-muted-foreground)]">
          {fallbackText}
        </div>
      )}
    </div>
  );
}

export interface ChartLegendItem {
  label: string;
  color: string;
  dashed?: boolean;
}

export interface BreakdownTableProps {
  id: string;
  title?: string;
  headers: string[];
  rows: Array<{ key: string | number; cells: Array<string | number>; highlightCol?: number }>;
}

export interface FourSectionLayoutProps {
  inputs: React.ReactNode;
  results: React.ReactNode;
  chartTitle?: string;
  legendItems?: ChartLegendItem[];
  chartNode: React.ReactNode;
  table: BreakdownTableProps;
  onReset: () => void;
  disclaimer?: string;
}

export function CalculatorFourSectionLayout({
  inputs,
  results,
  chartTitle = 'Interactive Visual Breakdown',
  legendItems = [],
  chartNode,
  table,
  onReset,
  disclaimer = 'For educational illustration only. Calculated values use standard compound interest formulas at your chosen assumptions and do not guarantee future returns. Mutual Fund investments are subject to market risks, read all scheme related documents carefully.',
}: FourSectionLayoutProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* UPPER ROW: Section 1 (Inputs) + Section 2 (Large Highlighted Results) */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        {/* Section 1: Inputs */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              1. Input Parameters
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="min-h-[34px] border border-[var(--color-border)] px-3 py-1 text-xs font-semibold text-[var(--color-muted-foreground)]"
            >
              <ArrowCounterClockwise size={14} weight="bold" aria-hidden="true" />
              <span>Reset</span>
            </Button>
          </div>
          {inputs}
        </div>

        {/* Section 2: Big Highlighted Results */}
        <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              2. Calculation Results
            </h3>
          </div>
          {results}
        </div>
      </div>

      {/* BOTTOM ROW: Section 3 (Chart) + Section 4 (Year-by-Year Table) */}
      <div className="grid grid-cols-1 gap-6 border-t border-[var(--color-border)] pt-8 lg:grid-cols-2">
        {/* Section 3: Interactive Chart */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
              3. {chartTitle}
            </h3>
            {legendItems.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[var(--color-foreground)]">
                {legendItems.map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className="inline-block h-0.5 w-5"
                      style={{
                        backgroundColor: item.dashed ? 'transparent' : item.color,
                        borderTop: item.dashed ? `2px dashed ${item.color}` : undefined,
                      }}
                    />
                    <span>{item.label}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
          {chartNode}
        </div>

        {/* Section 4: Year-by-Year Table */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
              <Table size={15} weight="regular" aria-hidden="true" />
              <span>4. {table.title ?? 'Year-by-Year Breakdown'}</span>
            </h3>
            <span className="numeric-tabular text-xs font-medium text-[var(--color-muted-foreground)]">
              {table.rows.length} {table.rows.length === 1 ? 'row' : 'rows'}
            </span>
          </div>

          <div
            id={table.id}
            data-lenis-prevent
            className="h-[300px] overflow-auto rounded-xl border border-[var(--color-border)] bg-white"
          >
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead className="sticky top-0 z-10 bg-[var(--color-muted)] text-xs font-semibold text-[var(--color-secondary)]">
                <tr>
                  {table.headers.map((header, idx) => (
                    <th
                      key={header}
                      scope="col"
                      className={cn('px-3 py-2.5 whitespace-nowrap', idx > 0 && 'text-right')}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] bg-white">
                {table.rows.map((row) => (
                  <tr key={row.key} className="hover:bg-[var(--color-background)]/60">
                    {row.cells.map((cell, idx) => (
                      <td
                        key={`${row.key}-${idx}`}
                        className={cn(
                          'numeric-tabular px-3 py-2 whitespace-nowrap',
                          idx === 0 ? 'font-medium text-[var(--color-secondary)]' : 'text-right',
                          row.highlightCol === idx && 'font-semibold text-[var(--color-growth-text)]',
                        )}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <p className="rounded-lg bg-[var(--color-muted)] px-4 py-3 text-xs leading-relaxed text-[var(--color-muted-foreground)]">
        {disclaimer}
      </p>
    </div>
  );
}
