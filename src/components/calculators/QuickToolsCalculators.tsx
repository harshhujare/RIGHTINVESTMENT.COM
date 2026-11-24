'use client';

import * as React from 'react';
import { Plus, Trash } from '@phosphor-icons/react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  calculateIrregularCashFlow,
  calculateSingleAmount,
  calculateWeightedAverageReturns,
  DEFAULT_IRREGULAR_CASH_FLOW_INPUT,
  DEFAULT_SINGLE_AMOUNT_INPUT,
  DEFAULT_WEIGHTED_AVG_INPUT,
  formatCompactINR,
  formatINR,
  type IrregularCashFlowInput,
  type SingleAmountInput,
  type TimeValueMode,
  type WeightedAvgInput,
} from '@/lib/calculators';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  AmountField,
  CalculatorFourSectionLayout,
  ChartContainer,
  KpiCard,
  SliderField,
} from './CalculatorControls';

export type QuickToolSlug =
  | 'single-amount'
  | 'irregular-cash-flow'
  | 'weighted-avg';

function ModeToggle({
  mode,
  onChange,
}: {
  mode: TimeValueMode;
  onChange: (next: TimeValueMode) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-[var(--color-foreground)]">
        Calculate
      </span>
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-1.5">
        <button
          type="button"
          aria-pressed={mode === 'pv'}
          onClick={() => onChange('pv')}
          className={cn(
            'min-h-[42px] cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-ring)]',
            mode === 'pv'
              ? 'bg-[var(--color-primary)] text-white shadow-xs'
              : 'text-[var(--color-foreground)] hover:bg-white',
          )}
        >
          Present Value
        </button>
        <button
          type="button"
          aria-pressed={mode === 'fv'}
          onClick={() => onChange('fv')}
          className={cn(
            'min-h-[42px] cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-ring)]',
            mode === 'fv'
              ? 'bg-[var(--color-primary)] text-white shadow-xs'
              : 'text-[var(--color-foreground)] hover:bg-white',
          )}
        >
          Future Value
        </button>
      </div>
    </div>
  );
}

function SingleAmountCalculator() {
  const [input, setInput] = React.useState<SingleAmountInput>(
    DEFAULT_SINGLE_AMOUNT_INPUT,
  );
  const result = React.useMemo(() => calculateSingleAmount(input), [input]);
  const isPV = input.mode === 'pv';

  return (
    <CalculatorFourSectionLayout
      onReset={() => setInput(DEFAULT_SINGLE_AMOUNT_INPUT)}
      inputs={
        <>
          <ModeToggle
            mode={input.mode}
            onChange={(mode) => setInput((prev) => ({ ...prev, mode }))}
          />

          <AmountField
            id="single-amount-val"
            label={isPV ? 'Future Amount Expected' : 'Present Investment Amount'}
            value={input.amount}
            onChange={(amount) => setInput((prev) => ({ ...prev, amount }))}
            sliderMin={10000}
            sliderMax={25000000}
            maxAllowed={500000000}
            step={10000}
          />

          <SliderField
            id="single-amount-years"
            label="After Years"
            value={input.afterYears}
            onChange={(afterYears) => setInput((prev) => ({ ...prev, afterYears }))}
            min={1}
            max={50}
            step={1}
            unit="Yrs"
          />

          <SliderField
            id="single-amount-rate"
            label={isPV ? 'Inflation / Discounting Rate' : 'Expected Return Rate'}
            value={input.rate}
            onChange={(rate) => setInput((prev) => ({ ...prev, rate }))}
            min={1}
            max={30}
            step={0.5}
            unit="% p.a."
            accent={isPV ? 'primary' : 'growth'}
          />
        </>
      }
      results={
        <>
          <KpiCard
            size="hero"
            label={isPV ? "Today's Present Value" : 'Projected Future Value'}
            value={formatINR(result.resultAmount)}
            subtext={
              isPV
                ? `Purchasing power of ${formatINR(input.amount)} after ${input.afterYears} yrs @ ${input.rate}%`
                : `Compounded value of ${formatINR(input.amount)} after ${input.afterYears} yrs @ ${input.rate}%`
            }
            tone={isPV ? 'primary' : 'growth'}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <KpiCard
              size="large"
              label={isPV ? 'Future Expected Amount' : 'Initial Amount'}
              value={formatINR(input.amount)}
              subtext={`Horizon: ${input.afterYears} year${input.afterYears === 1 ? '' : 's'}`}
              tone="neutral"
            />
            <KpiCard
              size="large"
              label={isPV ? 'Inflation Erosion' : 'Compounding Gain'}
              value={formatINR(result.differenceAmount)}
              subtext={`At ${input.rate}% annual rate`}
              tone={isPV ? 'warning' : 'growth'}
            />
          </div>
        </>
      }
      chartTitle={isPV ? 'Purchasing Power Curve' : 'Compounding Curve'}
      legendItems={[
        {
          label: isPV ? 'Purchasing Power Erosion' : 'Compounded Growth',
          color: isPV ? '#0B2E8A' : '#38982B',
        },
      ]}
      chartNode={
        <ChartContainer
          ariaLabel={`Single amount ${isPV ? 'present value' : 'future value'} chart resulting in ${formatINR(result.resultAmount)}`}
          fallbackText={formatINR(result.resultAmount)}
        >
          <AreaChart
            data={result.yearlyRows}
            margin={{ top: 12, right: 12, left: 4, bottom: 0 }}
          >
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: '#475569' }}
              tickFormatter={(val) => `Yr ${val}`}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#475569' }}
              width={76}
              tickFormatter={(val) => formatCompactINR(Number(val))}
            />
            <Tooltip
              formatter={(value) => [
                formatINR(Number(value ?? 0)),
                isPV ? 'Present Value' : 'Future Value',
              ]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPV ? '#0B2E8A' : '#38982B'}
              strokeWidth={2.5}
              fill={isPV ? '#0B2E8A' : '#38982B'}
              fillOpacity={0.14}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      }
      table={{
        id: 'single-amount-table',
        title: 'Year-by-Year Value Schedule',
        headers: [
          'Year',
          isPV ? "Equivalent Today's Value" : 'Compounded Value',
        ],
        rows: result.yearlyRows.map((row) => ({
          key: row.year,
          cells: [`Yr ${row.year}`, formatINR(row.value)],
          highlightCol: 1,
        })),
      }}
    />
  );
}

function IrregularCashFlowCalculator() {
  const [input, setInput] = React.useState<IrregularCashFlowInput>(
    DEFAULT_IRREGULAR_CASH_FLOW_INPUT,
  );
  const result = React.useMemo(() => calculateIrregularCashFlow(input), [input]);
  const isPV = input.mode === 'pv';

  const updateRow = (id: string, patch: { amount?: number; years?: number }) => {
    setInput((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  };

  const addRow = () => {
    setInput((prev) => ({
      ...prev,
      rows: [
        ...prev.rows,
        {
          id: `cf-${Date.now()}`,
          amount: 100000,
          years: Math.min(50, (prev.rows[prev.rows.length - 1]?.years ?? 0) + 1),
        },
      ],
    }));
  };

  const removeRow = (id: string) => {
    setInput((prev) => {
      if (prev.rows.length <= 1) return prev;
      return { ...prev, rows: prev.rows.filter((r) => r.id !== id) };
    });
  };

  return (
    <CalculatorFourSectionLayout
      onReset={() => setInput(DEFAULT_IRREGULAR_CASH_FLOW_INPUT)}
      inputs={
        <>
          <ModeToggle
            mode={input.mode}
            onChange={(mode) => setInput((prev) => ({ ...prev, mode }))}
          />

          <SliderField
            id="icf-rate"
            label={isPV ? 'Inflation / Discounting Rate' : 'Expected Return Rate'}
            value={input.rate}
            onChange={(rate) => setInput((prev) => ({ ...prev, rate }))}
            min={1}
            max={20}
            step={0.5}
            unit="% p.a."
            accent={isPV ? 'primary' : 'growth'}
          />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-foreground)]">
                Cash Flows ({input.rows.length})
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addRow}
                disabled={input.rows.length >= 12}
              >
                <Plus size={15} weight="bold" aria-hidden="true" />
                <span>Add Cash Flow</span>
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              {input.rows.map((row, index) => (
                <div
                  key={row.id}
                  className="flex flex-col gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                      Cash Flow #{index + 1}
                    </span>
                    {input.rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        aria-label={`Remove Cash Flow #${index + 1}`}
                        className="inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-md text-[var(--color-destructive)] hover:bg-[var(--color-destructive-soft)]"
                      >
                        <Trash size={16} weight="regular" aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`icf-amt-${row.id}`}
                        className="text-xs font-medium text-[var(--color-muted-foreground)]"
                      >
                        Amount (₹)
                      </label>
                      <input
                        id={`icf-amt-${row.id}`}
                        type="number"
                        min={0}
                        max={500000000}
                        step={10000}
                        value={row.amount}
                        onChange={(e) =>
                          updateRow(row.id, {
                            amount: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        className="numeric-tabular mt-1 min-h-[40px] w-full rounded-lg border-[1.5px] border-[var(--color-border-input)] bg-white px-2.5 py-1.5 text-sm font-bold text-[var(--color-secondary)]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`icf-yrs-${row.id}`}
                        className="text-xs font-medium text-[var(--color-muted-foreground)]"
                      >
                        After Years (1–50)
                      </label>
                      <input
                        id={`icf-yrs-${row.id}`}
                        type="number"
                        min={1}
                        max={50}
                        step={1}
                        value={row.years}
                        onChange={(e) =>
                          updateRow(row.id, {
                            years: Math.min(50, Math.max(1, Number(e.target.value) || 1)),
                          })
                        }
                        className="numeric-tabular mt-1 min-h-[40px] w-full rounded-lg border-[1.5px] border-[var(--color-border-input)] bg-white px-2.5 py-1.5 text-sm font-bold text-[var(--color-primary)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      }
      results={
        <>
          <KpiCard
            size="hero"
            label={isPV ? 'Combined Present Value' : 'Combined Future Value'}
            value={formatINR(result.totalAdjusted)}
            subtext={`Across ${result.computedRows.length} cash flows @ ${input.rate}% p.a.`}
            tone={isPV ? 'primary' : 'growth'}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <KpiCard
              size="large"
              label="Total Nominal Cash Flow"
              value={formatINR(result.totalNominal)}
              subtext={`Sum of all ${result.computedRows.length} entries`}
              tone="neutral"
            />
            <KpiCard
              size="large"
              label={isPV ? 'Time Discounting Impact' : 'Compounding Gain'}
              value={formatINR(result.differenceAmount)}
              subtext={`Difference vs. nominal total`}
              tone={isPV ? 'warning' : 'growth'}
            />
          </div>
        </>
      }
      chartTitle="Nominal vs. Time-Adjusted Cash Flows"
      legendItems={[
        { label: 'Nominal Cash Flow', color: '#0B2E8A' },
        { label: isPV ? 'Present Value' : 'Future Value', color: '#38982B' },
      ]}
      chartNode={
        <ChartContainer
          ariaLabel={`Irregular cash flow bar comparison showing total adjusted value of ${formatINR(result.totalAdjusted)}`}
          fallbackText={formatINR(result.totalAdjusted)}
        >
          <BarChart
            data={result.computedRows}
            margin={{ top: 12, right: 12, left: 4, bottom: 0 }}
          >
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#475569' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#475569' }}
              width={76}
              tickFormatter={(val) => formatCompactINR(Number(val))}
            />
            <Tooltip
              formatter={(value, name) => [
                formatINR(Number(value ?? 0)),
                name === 'amount'
                  ? 'Nominal Amount'
                  : isPV
                    ? 'Present Value'
                    : 'Future Value',
              ]}
            />
            <Bar
              dataKey="amount"
              fill="#0B2E8A"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="adjustedValue"
              fill="#38982B"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      }
      table={{
        id: 'irregular-cf-table',
        title: 'Cash-Flow Breakdown Table',
        headers: [
          'Cash Flow',
          'Year',
          'Nominal Amount',
          isPV ? 'Present Value' : 'Future Value',
        ],
        rows: result.computedRows.map((row) => ({
          key: row.id,
          cells: [
            row.label,
            `Yr ${row.years}`,
            formatINR(row.amount),
            formatINR(row.adjustedValue),
          ],
          highlightCol: 3,
        })),
      }}
    />
  );
}

function WeightedAverageReturnsCalculator() {
  const [input, setInput] = React.useState<WeightedAvgInput>(
    DEFAULT_WEIGHTED_AVG_INPUT,
  );
  const result = React.useMemo(
    () => calculateWeightedAverageReturns(input),
    [input],
  );

  const updateRow = (
    id: string,
    patch: { label?: string; amount?: number; returnRate?: number },
  ) => {
    setInput((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  };

  const addRow = () => {
    setInput((prev) => ({
      ...prev,
      rows: [
        ...prev.rows,
        {
          id: `wa-${Date.now()}`,
          label: `Asset Class ${prev.rows.length + 1}`,
          amount: 100000,
          returnRate: 10,
        },
      ],
    }));
  };

  const removeRow = (id: string) => {
    setInput((prev) => {
      if (prev.rows.length <= 1) return prev;
      return { ...prev, rows: prev.rows.filter((r) => r.id !== id) };
    });
  };

  return (
    <CalculatorFourSectionLayout
      onReset={() => setInput(DEFAULT_WEIGHTED_AVG_INPUT)}
      inputs={
        <>
          <SliderField
            id="wa-years"
            label="Future Value After"
            value={input.afterYears}
            onChange={(afterYears) => setInput((prev) => ({ ...prev, afterYears }))}
            min={1}
            max={50}
            step={1}
            unit="Yrs"
          />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-foreground)]">
                Portfolio Asset Classes ({input.rows.length})
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addRow}
                disabled={input.rows.length >= 10}
              >
                <Plus size={15} weight="bold" aria-hidden="true" />
                <span>Add Asset</span>
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              {input.rows.map((row, index) => (
                <div
                  key={row.id}
                  className="flex flex-col gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      aria-label={`Asset ${index + 1} label`}
                      type="text"
                      maxLength={40}
                      value={row.label}
                      onChange={(e) => updateRow(row.id, { label: e.target.value })}
                      className="min-h-[36px] flex-1 rounded-md border border-[var(--color-border)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--color-secondary)]"
                    />
                    {input.rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        aria-label={`Remove ${row.label}`}
                        className="inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-md text-[var(--color-destructive)] hover:bg-[var(--color-destructive-soft)]"
                      >
                        <Trash size={16} weight="regular" aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`wa-amt-${row.id}`}
                        className="text-xs font-medium text-[var(--color-muted-foreground)]"
                      >
                        Investment Amount (₹)
                      </label>
                      <input
                        id={`wa-amt-${row.id}`}
                        type="number"
                        min={0}
                        max={500000000}
                        step={10000}
                        value={row.amount}
                        onChange={(e) =>
                          updateRow(row.id, {
                            amount: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        className="numeric-tabular mt-1 min-h-[40px] w-full rounded-lg border-[1.5px] border-[var(--color-border-input)] bg-white px-2.5 py-1.5 text-sm font-bold text-[var(--color-secondary)]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`wa-ret-${row.id}`}
                        className="text-xs font-medium text-[var(--color-muted-foreground)]"
                      >
                        Expected Return (% p.a.)
                      </label>
                      <input
                        id={`wa-ret-${row.id}`}
                        type="number"
                        min={0}
                        max={30}
                        step={0.5}
                        value={row.returnRate}
                        onChange={(e) =>
                          updateRow(row.id, {
                            returnRate: Math.min(30, Math.max(0, Number(e.target.value) || 0)),
                          })
                        }
                        className="numeric-tabular mt-1 min-h-[40px] w-full rounded-lg border-[1.5px] border-[var(--color-border-input)] bg-white px-2.5 py-1.5 text-sm font-bold text-[var(--color-growth-text)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      }
      results={
        <>
          <KpiCard
            size="hero"
            label="Estimated Future Value"
            value={formatINR(result.estimatedFutureValue)}
            subtext={`${formatCompactINR(result.estimatedFutureValue)} after ${input.afterYears} years`}
            tone="primary"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <KpiCard
              size="large"
              label="Weighted Avg. Return"
              value={`${result.weightedAvgReturn.toFixed(2)}%`}
              subtext="Blended portfolio CAGR"
              tone="growth"
            />
            <KpiCard
              size="large"
              label="Total Invested Amount"
              value={formatINR(result.totalInvested)}
              subtext={`Est. gain: ${formatINR(result.estimatedGain)}`}
              tone="neutral"
            />
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              Asset Allocation &amp; Weight Breakdown
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.computedRows.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs"
                >
                  <span className="font-semibold text-[var(--color-secondary)]">
                    {row.label}
                  </span>
                  <span className="numeric-tabular rounded bg-[var(--color-primary-soft)] px-1.5 py-0.5 font-bold text-[var(--color-primary)]">
                    {row.weightPercent}%
                  </span>
                  <span className="numeric-tabular font-semibold text-[var(--color-growth-text)]">
                    @{row.returnRate}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      }
      chartTitle="Blended Portfolio Growth"
      legendItems={[
        { label: 'Invested Capital', color: '#0B2E8A' },
        { label: 'Blended Value', color: '#38982B' },
      ]}
      chartNode={
        <ChartContainer
          ariaLabel={`Weighted average portfolio projection at ${result.weightedAvgReturn}% growing to ${formatINR(result.estimatedFutureValue)}`}
          fallbackText={formatCompactINR(result.estimatedFutureValue)}
        >
          <AreaChart
            data={result.yearlyRows}
            margin={{ top: 12, right: 12, left: 4, bottom: 0 }}
          >
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: '#475569' }}
              tickFormatter={(val) => `Yr ${val}`}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#475569' }}
              width={76}
              tickFormatter={(val) => formatCompactINR(Number(val))}
            />
            <Tooltip
              formatter={(value, name) => [
                formatINR(Number(value ?? 0)),
                name === 'invested' ? 'Invested Capital' : 'Portfolio Value',
              ]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Area
              type="monotone"
              dataKey="invested"
              stroke="#0B2E8A"
              strokeWidth={2}
              fill="#0B2E8A"
              fillOpacity={0.08}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="portfolioValue"
              stroke="#38982B"
              strokeWidth={2.5}
              fill="#38982B"
              fillOpacity={0.14}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      }
      table={{
        id: 'weighted-avg-table',
        title: 'Year-by-Year Portfolio Schedule',
        headers: ['Year', 'Invested Capital', 'Projected Portfolio Value'],
        rows: result.yearlyRows.map((row) => ({
          key: row.year,
          cells: [
            `Yr ${row.year}`,
            formatINR(row.invested),
            formatINR(row.portfolioValue),
          ],
          highlightCol: 2,
        })),
      }}
    />
  );
}

export function QuickToolsCalculators({ activeSlug }: { activeSlug: QuickToolSlug }) {
  return (
    <div className={cn('w-full')}>
      {activeSlug === 'single-amount' && <SingleAmountCalculator />}
      {activeSlug === 'irregular-cash-flow' && <IrregularCashFlowCalculator />}
      {activeSlug === 'weighted-avg' && <WeightedAverageReturnsCalculator />}
    </div>
  );
}
