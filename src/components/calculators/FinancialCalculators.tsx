'use client';

import * as React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  calculateEmi,
  calculateSipDelayCost,
  calculateSipGrowth,
  calculateSipNeed,
  calculateSwp,
  DEFAULT_EMI_INPUT,
  DEFAULT_SIP_DELAY_INPUT,
  DEFAULT_SIP_GROWTH_INPUT,
  DEFAULT_SIP_NEED_INPUT,
  DEFAULT_SWP_INPUT,
  formatCompactINR,
  formatINR,
  type EmiInput,
  type SipDelayCostInput,
  type SipGrowthInput,
  type SipNeedInput,
  type SwpInput,
} from '@/lib/calculators';
import { cn } from '@/lib/utils';
import {
  AmountField,
  CalculatorFourSectionLayout,
  ChartContainer,
  KpiCard,
  SliderField,
  StepUpControl,
} from './CalculatorControls';

export type FinancialSlug =
  | 'sip-growth'
  | 'sip-need'
  | 'sip-delay'
  | 'swp'
  | 'emi';

function SipGrowthCalculator() {
  const [input, setInput] = React.useState<SipGrowthInput>(DEFAULT_SIP_GROWTH_INPUT);
  const result = React.useMemo(() => calculateSipGrowth(input), [input]);
  const hasStepUp = input.stepUp.mode !== 'none' && input.stepUp.value > 0;

  return (
    <CalculatorFourSectionLayout
      onReset={() => setInput(DEFAULT_SIP_GROWTH_INPUT)}
      inputs={
        <>
          <AmountField
            id="sip-growth-monthly"
            label="Monthly Investment Amount"
            value={input.monthlyInvestment}
            onChange={(v) => setInput((prev) => ({ ...prev, monthlyInvestment: v }))}
            sliderMin={500}
            sliderMax={200000}
            maxAllowed={10000000}
            step={500}
          />

          <SliderField
            id="sip-growth-years"
            label="Investment Period"
            value={input.years}
            onChange={(v) => setInput((prev) => ({ ...prev, years: v }))}
            min={1}
            max={50}
            step={1}
            unit="Yrs"
          />

          <SliderField
            id="sip-growth-return"
            label="Expected Returns"
            value={input.expectedReturn}
            onChange={(v) => setInput((prev) => ({ ...prev, expectedReturn: v }))}
            min={1}
            max={20}
            step={0.5}
            unit="% p.a."
            accent="growth"
          />

          <StepUpControl
            value={input.stepUp}
            onChange={(stepUp) => setInput((prev) => ({ ...prev, stepUp }))}
          />
        </>
      }
      results={
        <>
          <KpiCard
            size="hero"
            label="Estimated Future Value"
            value={formatINR(result.estimatedFutureValue)}
            subtext={`${formatCompactINR(result.estimatedFutureValue)} · Growth multiple ${result.growthMultiple} times`}
            tone="primary"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <KpiCard
              size="large"
              label="Total Amount Invested"
              value={formatINR(result.totalInvested)}
              subtext={`Over ${input.years} years (${input.years * 12} instalments)`}
              tone="neutral"
            />
            <KpiCard
              size="large"
              label="Estimated Wealth Gain"
              value={formatINR(result.wealthGain)}
              subtext={`${result.growthMultiple}x total wealth multiple`}
              tone="growth"
            />
          </div>
        </>
      }
      chartTitle="SIP Compounding Curve"
      legendItems={[
        { label: 'Amount Invested', color: '#0B2E8A' },
        { label: hasStepUp ? 'Step-Up SIP Value' : 'Estimated Value', color: '#38982B' },
        ...(hasStepUp
          ? [{ label: 'Without Step-Up', color: '#926207', dashed: true }]
          : []),
      ]}
      chartNode={
        <ChartContainer
          ariaLabel={`SIP growth projection of ${formatINR(input.monthlyInvestment)} per month for ${input.years} years yielding ${formatINR(result.estimatedFutureValue)}`}
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
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#475569' }}
              width={76}
              tickFormatter={(val) => formatCompactINR(Number(val))}
            />
            <Tooltip
              formatter={(value, name) => [
                formatINR(Number(value ?? 0)),
                name === 'invested'
                  ? 'Amount Invested'
                  : name === 'baseSipValue'
                    ? 'Without Step-Up'
                    : 'Estimated Value',
              ]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Area
              type="monotone"
              dataKey="invested"
              stroke="#0B2E8A"
              strokeWidth={2}
              fill="#0B2E8A"
              fillOpacity={0.1}
              isAnimationActive={false}
            />
            {hasStepUp && (
              <Area
                type="monotone"
                dataKey="baseSipValue"
                stroke="#926207"
                strokeWidth={2}
                strokeDasharray="5 4"
                fill="none"
                isAnimationActive={false}
              />
            )}
            <Area
              type="monotone"
              dataKey="estimatedValue"
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
        id: 'sip-growth-table',
        title: 'Year-by-Year SIP Schedule',
        headers: ['Year', 'Invested', 'Wealth Gain', 'Estimated Value'],
        rows: result.yearlyRows.map((row) => ({
          key: row.year,
          cells: [
            `Yr ${row.year}`,
            formatINR(row.invested),
            formatINR(row.wealthGain),
            formatINR(row.estimatedValue),
          ],
          highlightCol: 3,
        })),
      }}
    />
  );
}

function SipNeedCalculator() {
  const [input, setInput] = React.useState<SipNeedInput>(DEFAULT_SIP_NEED_INPUT);
  const result = React.useMemo(() => calculateSipNeed(input), [input]);

  return (
    <CalculatorFourSectionLayout
      onReset={() => setInput(DEFAULT_SIP_NEED_INPUT)}
      inputs={
        <>
          <AmountField
            id="sip-need-target"
            label="Target Amount Needed (Today's Value)"
            value={input.targetAmountToday}
            onChange={(v) => setInput((prev) => ({ ...prev, targetAmountToday: v }))}
            sliderMin={100000}
            sliderMax={50000000}
            maxAllowed={500000000}
            step={100000}
          />

          <SliderField
            id="sip-need-years"
            label="Investment Period"
            value={input.years}
            onChange={(v) => setInput((prev) => ({ ...prev, years: v }))}
            min={1}
            max={50}
            step={1}
            unit="Yrs"
          />

          <SliderField
            id="sip-need-return"
            label="Expected Returns"
            value={input.expectedReturn}
            onChange={(v) => setInput((prev) => ({ ...prev, expectedReturn: v }))}
            min={1}
            max={20}
            step={0.5}
            unit="% p.a."
            accent="growth"
          />

          <SliderField
            id="sip-need-inflation"
            label="Expected Inflation"
            value={input.inflation}
            onChange={(v) => setInput((prev) => ({ ...prev, inflation: v }))}
            min={0}
            max={15}
            step={0.5}
            unit="% p.a."
          />

          <StepUpControl
            value={input.stepUp}
            onChange={(stepUp) => setInput((prev) => ({ ...prev, stepUp }))}
          />
        </>
      }
      results={
        <>
          <KpiCard
            size="hero"
            label="Required Monthly SIP Amount"
            value={formatINR(result.requiredSipAmount)}
            subtext={`Starting monthly SIP to achieve ${formatCompactINR(result.targetAmountRequired)}`}
            tone="primary"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <KpiCard
              size="large"
              label="Target Amount Required"
              value={formatINR(result.targetAmountRequired)}
              subtext={`Inflation-adjusted in ${input.years} yrs`}
              tone="neutral"
            />
            <KpiCard
              size="large"
              label="Projected Investment"
              value={formatINR(result.projectedInvestment)}
              subtext={`Total SIP outflow`}
              tone="neutral"
            />
          </div>

          <KpiCard
            size="large"
            label="Estimated Gain & Multiple"
            value={`${formatINR(result.estimatedGain)} (${result.growthMultiple}x)`}
            subtext={`Wealth created through compounding`}
            tone="growth"
          />
        </>
      }
      chartTitle="Goal Accumulation Path"
      legendItems={[
        { label: 'Cumulative SIP Invested', color: '#0B2E8A' },
        { label: 'Projected Value', color: '#38982B' },
      ]}
      chartNode={
        <ChartContainer
          ariaLabel={`SIP Need trajectory requiring ${formatINR(result.requiredSipAmount)} monthly to reach ${formatINR(result.targetAmountRequired)}`}
          fallbackText={formatCompactINR(result.targetAmountRequired)}
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
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#475569' }}
              width={76}
              tickFormatter={(val) => formatCompactINR(Number(val))}
            />
            <Tooltip
              formatter={(value, name) => [
                formatINR(Number(value ?? 0)),
                name === 'invested' ? 'Cumulative Invested' : 'Projected Value',
              ]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Area
              type="monotone"
              dataKey="invested"
              stroke="#0B2E8A"
              strokeWidth={2}
              fill="#0B2E8A"
              fillOpacity={0.1}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="estimatedValue"
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
        id: 'sip-need-table',
        title: 'Year-by-Year Target Schedule',
        headers: ['Year', 'Invested', 'Wealth Gain', 'Projected Value'],
        rows: result.yearlyRows.map((row) => ({
          key: row.year,
          cells: [
            `Yr ${row.year}`,
            formatINR(row.invested),
            formatINR(row.wealthGain),
            formatINR(row.estimatedValue),
          ],
          highlightCol: 3,
        })),
      }}
    />
  );
}

function SipDelayCostCalculator() {
  const [input, setInput] = React.useState<SipDelayCostInput>(DEFAULT_SIP_DELAY_INPUT);
  const result = React.useMemo(() => calculateSipDelayCost(input), [input]);
  const maxDelay = Math.max(1, input.years * 12 - 1);

  return (
    <CalculatorFourSectionLayout
      onReset={() => setInput(DEFAULT_SIP_DELAY_INPUT)}
      inputs={
        <>
          <AmountField
            id="sip-delay-monthly"
            label="Monthly Investment Amount"
            value={input.monthlyInvestment}
            onChange={(v) => setInput((prev) => ({ ...prev, monthlyInvestment: v }))}
            sliderMin={500}
            sliderMax={200000}
            maxAllowed={10000000}
            step={500}
          />

          <SliderField
            id="sip-delay-years"
            label="Investment Period"
            value={input.years}
            onChange={(v) =>
              setInput((prev) => ({
                ...prev,
                years: v,
                delayMonths: Math.min(prev.delayMonths, Math.max(1, v * 12 - 1)),
              }))
            }
            min={1}
            max={50}
            step={1}
            unit="Yrs"
          />

          <SliderField
            id="sip-delay-return"
            label="Expected Returns"
            value={input.expectedReturn}
            onChange={(v) => setInput((prev) => ({ ...prev, expectedReturn: v }))}
            min={1}
            max={20}
            step={0.5}
            unit="% p.a."
            accent="growth"
          />

          <SliderField
            id="sip-delay-months"
            label="Delay in Starting SIP"
            value={input.delayMonths}
            onChange={(v) => setInput((prev) => ({ ...prev, delayMonths: v }))}
            min={1}
            max={Math.min(120, maxDelay)}
            step={1}
            unit="Mos"
          />
        </>
      }
      results={
        <>
          <KpiCard
            size="hero"
            label="Estimated SIP Delay Cost"
            value={formatINR(result.delayCost)}
            subtext={`Opportunity cost of waiting ${input.delayMonths} month${input.delayMonths === 1 ? '' : 's'}`}
            tone="warning"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <KpiCard
              size="large"
              label="Projected FV (Without Delay)"
              value={formatINR(result.fvWithoutDelay)}
              subtext={`Invested: ${formatINR(result.investedWithoutDelay)}`}
              tone="growth"
            />
            <KpiCard
              size="large"
              label="Projected FV (With Delay)"
              value={formatINR(result.fvWithDelay)}
              subtext={`Invested: ${formatINR(result.investedWithDelay)}`}
              tone="primary"
            />
          </div>
        </>
      }
      chartTitle="Start Today vs. Delayed Start"
      legendItems={[
        { label: 'Start Today', color: '#38982B' },
        { label: `Delayed ${input.delayMonths} mo(s)`, color: '#0B2E8A', dashed: true },
      ]}
      chartNode={
        <ChartContainer
          ariaLabel={`SIP delay cost comparison showing ${formatINR(result.delayCost)} opportunity loss for a ${input.delayMonths}-month delay`}
          fallbackText={formatINR(result.delayCost)}
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
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#475569' }}
              width={76}
              tickFormatter={(val) => formatCompactINR(Number(val))}
            />
            <Tooltip
              formatter={(value, name) => [
                formatINR(Number(value ?? 0)),
                name === 'withoutDelay' ? 'Start Today' : 'Delayed Start',
              ]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Area
              type="monotone"
              dataKey="withoutDelay"
              stroke="#38982B"
              strokeWidth={2.5}
              fill="#38982B"
              fillOpacity={0.14}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="withDelay"
              stroke="#0B2E8A"
              strokeWidth={2}
              strokeDasharray="5 4"
              fill="#0B2E8A"
              fillOpacity={0.08}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      }
      table={{
        id: 'sip-delay-table',
        title: 'Year-by-Year Delay Impact',
        headers: ['Year', 'Start Today', 'Delayed Start', 'Delay Cost Gap'],
        rows: result.yearlyRows.map((row) => ({
          key: row.year,
          cells: [
            `Yr ${row.year}`,
            formatINR(row.withoutDelay),
            formatINR(row.withDelay),
            formatINR(row.gap),
          ],
          highlightCol: 1,
        })),
      }}
    />
  );
}

function SwpCalculator() {
  const [input, setInput] = React.useState<SwpInput>(DEFAULT_SWP_INPUT);
  const result = React.useMemo(() => calculateSwp(input), [input]);

  const lifeSummary = result.isPerpetual
    ? 'Runs till perpetuity'
    : `${result.estimatedFullLifeInstalments} mos (~${(result.estimatedFullLifeInstalments / 12).toFixed(1)} yrs)`;

  return (
    <CalculatorFourSectionLayout
      onReset={() => setInput(DEFAULT_SWP_INPUT)}
      inputs={
        <>
          <AmountField
            id="swp-initial"
            label="Initial Investment Amount"
            value={input.initialInvestment}
            onChange={(v) => setInput((prev) => ({ ...prev, initialInvestment: v }))}
            sliderMin={100000}
            sliderMax={50000000}
            maxAllowed={500000000}
            step={100000}
          />

          <AmountField
            id="swp-withdrawal"
            label="Monthly Withdrawal Amount"
            value={input.monthlyWithdrawal}
            onChange={(v) => setInput((prev) => ({ ...prev, monthlyWithdrawal: v }))}
            sliderMin={1000}
            sliderMax={500000}
            maxAllowed={10000000}
            step={1000}
          />

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={input.increaseYearly}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, increaseYearly: e.target.checked }))
                }
                className="mt-1 h-4 w-4 cursor-pointer accent-[var(--color-primary)]"
              />
              <span className="text-sm font-semibold text-[var(--color-foreground)]">
                Increase withdrawal amount yearly (inflation-adjusted SWP)
              </span>
            </label>
            {input.increaseYearly && (
              <div className="mt-4">
                <SliderField
                  id="swp-yearly-inc"
                  label="Yearly Increase in SWP Amount"
                  value={input.yearlyIncreasePercent}
                  onChange={(v) =>
                    setInput((prev) => ({ ...prev, yearlyIncreasePercent: v }))
                  }
                  min={0}
                  max={15}
                  step={0.5}
                  unit="%"
                />
              </div>
            )}
          </div>

          <SliderField
            id="swp-return"
            label="Expected Returns"
            value={input.expectedReturn}
            onChange={(v) => setInput((prev) => ({ ...prev, expectedReturn: v }))}
            min={2}
            max={15}
            step={0.5}
            unit="% p.a."
            accent="growth"
          />

          <SliderField
            id="swp-start-after"
            label="SWP Start After"
            value={input.startAfterYears}
            onChange={(v) =>
              setInput((prev) => ({
                ...prev,
                startAfterYears: Math.min(v, Math.max(0, prev.horizonYears - 1)),
              }))
            }
            min={0}
            max={Math.max(0, input.horizonYears - 1)}
            step={1}
            unit="Yrs"
          />

          <SliderField
            id="swp-horizon"
            label="Investment Horizon / Check After"
            value={input.horizonYears}
            onChange={(v) =>
              setInput((prev) => ({
                ...prev,
                horizonYears: v,
                startAfterYears: Math.min(prev.startAfterYears, Math.max(0, v - 1)),
              }))
            }
            min={1}
            max={50}
            step={1}
            unit="Yrs"
          />
        </>
      }
      results={
        <>
          <KpiCard
            size="hero"
            label="Period End Corpus Value"
            value={formatINR(result.periodEndValue)}
            subtext={`Remaining balance after ${input.horizonYears} years (${formatCompactINR(result.periodEndValue)})`}
            tone="primary"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <KpiCard
              size="large"
              label="Total Amount Withdrawn"
              value={formatINR(result.totalWithdrawn)}
              subtext={`${result.fullInstalmentsWithdrawn} instalments (last: ${result.lastInstalmentDateLabel})`}
              tone="growth"
            />
            <KpiCard
              size="large"
              label="Estimated Full SWP Life"
              value={lifeSummary}
              subtext={
                result.isPerpetual
                  ? 'Corpus keeps compounding above payouts'
                  : 'Total duration corpus sustains withdrawals'
              }
              tone={result.isPerpetual ? 'growth' : 'neutral'}
            />
          </div>
        </>
      }
      chartTitle="Corpus Balance vs. Cumulative Withdrawals"
      legendItems={[
        { label: 'Remaining Corpus', color: '#0B2E8A' },
        { label: 'Cumulative Withdrawn', color: '#38982B' },
      ]}
      chartNode={
        <ChartContainer
          ariaLabel={`SWP corpus projection showing ${formatINR(result.periodEndValue)} ending value and ${formatINR(result.totalWithdrawn)} withdrawn`}
          fallbackText={formatCompactINR(result.periodEndValue)}
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
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#475569' }}
              width={76}
              tickFormatter={(val) => formatCompactINR(Number(val))}
            />
            <Tooltip
              formatter={(value, name) => [
                formatINR(Number(value ?? 0)),
                name === 'remainingCorpus'
                  ? 'Remaining Corpus'
                  : 'Cumulative Withdrawn',
              ]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Area
              type="monotone"
              dataKey="remainingCorpus"
              stroke="#0B2E8A"
              strokeWidth={2.5}
              fill="#0B2E8A"
              fillOpacity={0.12}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="cumulativeWithdrawn"
              stroke="#38982B"
              strokeWidth={2.5}
              fill="#38982B"
              fillOpacity={0.12}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      }
      table={{
        id: 'swp-yearly-table',
        title: 'Year-by-Year SWP Schedule',
        headers: ['Year', 'Yearly Payout', 'Cum. Withdrawn', 'Ending Corpus'],
        rows: result.yearlyRows.map((row) => ({
          key: row.year,
          cells: [
            `Yr ${row.year}`,
            formatINR(row.yearlyWithdrawn),
            formatINR(row.cumulativeWithdrawn),
            formatINR(row.remainingCorpus),
          ],
          highlightCol: 3,
        })),
      }}
    />
  );
}

function EmiCalculator() {
  const [input, setInput] = React.useState<EmiInput>(DEFAULT_EMI_INPUT);
  const result = React.useMemo(() => calculateEmi(input), [input]);

  return (
    <CalculatorFourSectionLayout
      onReset={() => setInput(DEFAULT_EMI_INPUT)}
      disclaimer="EMI figures are calculated using standard reducing-balance amortization. Actual lender schedules may vary based on reset dates, processing fees, or prepayments."
      inputs={
        <>
          <AmountField
            id="emi-loan-amount"
            label="Loan Amount"
            value={input.loanAmount}
            onChange={(v) => setInput((prev) => ({ ...prev, loanAmount: v }))}
            sliderMin={100000}
            sliderMax={50000000}
            maxAllowed={500000000}
            step={100000}
          />

          <SliderField
            id="emi-duration"
            label="Loan Duration"
            value={input.loanDurationYears}
            onChange={(v) =>
              setInput((prev) => ({
                ...prev,
                loanDurationYears: v,
                checkAfterYears: Math.min(prev.checkAfterYears, v),
              }))
            }
            min={1}
            max={50}
            step={1}
            unit="Yrs"
          />

          <SliderField
            id="emi-rate"
            label="Rate of Interest"
            value={input.interestRate}
            onChange={(v) => setInput((prev) => ({ ...prev, interestRate: v }))}
            min={1}
            max={30}
            step={0.25}
            unit="% p.a."
          />

          <SliderField
            id="emi-check-after"
            label="Check Loan Status After (Optional)"
            value={input.checkAfterYears}
            onChange={(v) => setInput((prev) => ({ ...prev, checkAfterYears: v }))}
            min={0}
            max={input.loanDurationYears}
            step={1}
            unit="Yrs"
            accent="growth"
            helperText="Set above 0 to inspect your outstanding balance and interest paid at any year."
          />
        </>
      }
      results={
        <>
          <KpiCard
            size="hero"
            label="Estimated Monthly EMI"
            value={formatINR(result.monthlyEmi)}
            subtext={`For ${input.loanDurationYears * 12} monthly instalments @ ${input.interestRate}% p.a.`}
            tone="primary"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <KpiCard
              size="large"
              label="Total Interest Payable"
              value={formatINR(result.totalInterest)}
              subtext={`Principal: ${formatINR(input.loanAmount)}`}
              tone="warning"
            />
            <KpiCard
              size="large"
              label="Total Amount You Will Pay"
              value={formatINR(result.totalPayable)}
              subtext={formatCompactINR(result.totalPayable)}
              tone="neutral"
            />
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              Mid-Tenure Snapshot — After {result.checkAfterYears} Year
              {result.checkAfterYears === 1 ? '' : 's'}
            </p>
            {result.checkAfterYears > 0 && result.outstandingAfterX !== null ? (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Outstanding Loan
                  </p>
                  <p className="numeric-tabular mt-1 text-base font-bold text-[var(--color-secondary)]">
                    {formatINR(result.outstandingAfterX)}
                  </p>
                </div>
                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Paid Till Date
                  </p>
                  <p className="numeric-tabular mt-1 text-base font-bold text-[var(--color-primary)]">
                    {formatINR(result.amountPaidTillDate ?? 0)}
                  </p>
                </div>
                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Interest Paid
                  </p>
                  <p className="numeric-tabular mt-1 text-base font-bold text-[var(--color-destructive)]">
                    {formatINR(result.interestPaidTillDate ?? 0)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-1.5 text-sm text-[var(--color-muted-foreground)]">
                Slide &ldquo;Check Loan Status After&rdquo; above 0 to inspect your mid-tenure balance.
              </p>
            )}
          </div>
        </>
      }
      chartTitle="Loan Amortization Schedule"
      legendItems={[
        { label: 'Outstanding', color: '#0B2E8A' },
        { label: 'Principal Paid', color: '#38982B' },
        { label: 'Interest Paid', color: '#926207', dashed: true },
      ]}
      chartNode={
        <ChartContainer
          ariaLabel={`Loan amortization chart for ${formatINR(input.loanAmount)} at ${input.interestRate}% over ${input.loanDurationYears} years`}
          fallbackText={`EMI ${formatINR(result.monthlyEmi)}`}
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
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#475569' }}
              width={76}
              tickFormatter={(val) => formatCompactINR(Number(val))}
            />
            <Tooltip
              formatter={(value, name) => [
                formatINR(Number(value ?? 0)),
                name === 'outstandingBalance'
                  ? 'Outstanding Balance'
                  : name === 'principalPaidCumulative'
                    ? 'Principal Paid'
                    : 'Interest Paid',
              ]}
              labelFormatter={(label) => `Year ${label}`}
            />
            {result.checkAfterYears > 0 && (
              <ReferenceLine
                x={result.checkAfterYears}
                stroke="#0A1628"
                strokeDasharray="4 4"
                strokeWidth={2}
              />
            )}
            <Area
              type="monotone"
              dataKey="outstandingBalance"
              stroke="#0B2E8A"
              strokeWidth={2.5}
              fill="#0B2E8A"
              fillOpacity={0.12}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="principalPaidCumulative"
              stroke="#38982B"
              strokeWidth={2}
              fill="#38982B"
              fillOpacity={0.1}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="interestPaidCumulative"
              stroke="#926207"
              strokeWidth={2}
              strokeDasharray="5 4"
              fill="none"
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      }
      table={{
        id: 'emi-amortization-table',
        title: 'Year-by-Year Amortization Table',
        headers: ['Year', 'Principal Paid', 'Interest Paid', 'Outstanding'],
        rows: result.yearlyRows.map((row) => ({
          key: row.year,
          cells: [
            `Yr ${row.year}`,
            formatINR(row.principalPaidCumulative),
            formatINR(row.interestPaidCumulative),
            formatINR(row.outstandingBalance),
          ],
          highlightCol: 3,
        })),
      }}
    />
  );
}

export function FinancialCalculators({ activeSlug }: { activeSlug: FinancialSlug }) {
  return (
    <div className={cn('w-full')}>
      {activeSlug === 'sip-growth' && <SipGrowthCalculator />}
      {activeSlug === 'sip-need' && <SipNeedCalculator />}
      {activeSlug === 'sip-delay' && <SipDelayCostCalculator />}
      {activeSlug === 'swp' && <SwpCalculator />}
      {activeSlug === 'emi' && <EmiCalculator />}
    </div>
  );
}
