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
  calculateLifeGoal,
  calculateRetirementPlan,
  DEFAULT_CHILD_EDUCATION_INPUT,
  DEFAULT_MARRIAGE_INPUT,
  DEFAULT_OTHER_GOAL_INPUT,
  DEFAULT_RETIREMENT_INPUT,
  formatCompactINR,
  formatINR,
  type LifeGoalInput,
  type RetirementInput,
} from '@/lib/calculators';
import { cn } from '@/lib/utils';
import {
  AmountField,
  CalculatorFourSectionLayout,
  ChartContainer,
  ExistingInvestmentsControl,
  ExpandableSection,
  KpiCard,
  SliderField,
  StepUpControl,
} from './CalculatorControls';

export type LifeGoalSlug =
  | 'retirement'
  | 'child-education'
  | 'child-marriage'
  | 'other-goal';

function ThreeWayInvestmentStrip({
  monthly,
  yearly,
  oneTime,
}: {
  monthly: number;
  yearly: number;
  oneTime: number;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)]">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
        Required Investment Amount (Choose Any Option)
      </p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--color-primary)]/25 bg-[var(--color-primary-soft)]/55 p-3">
          <p className="text-xs font-medium text-[var(--color-primary)]">
            Monthly SIP
          </p>
          <p className="numeric-tabular mt-1 text-xl font-bold text-[var(--color-primary)] sm:text-2xl">
            {formatINR(monthly)}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
          <p className="text-xs font-medium text-[var(--color-muted-foreground)]">
            Yearly Investment
          </p>
          <p className="numeric-tabular mt-1 text-lg font-bold text-[var(--color-secondary)] sm:text-xl">
            {formatINR(yearly)}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
          <p className="text-xs font-medium text-[var(--color-muted-foreground)]">
            One-Time Lump Sum
          </p>
          <p className="numeric-tabular mt-1 text-lg font-bold text-[var(--color-secondary)] sm:text-xl">
            {formatINR(oneTime)}
          </p>
        </div>
      </div>
    </div>
  );
}

function PlanYourRetirementCalculator() {
  const [input, setInput] = React.useState<RetirementInput>(DEFAULT_RETIREMENT_INPUT);
  const result = React.useMemo(() => calculateRetirementPlan(input), [input]);

  const assumptionsSummary = `Life Exp. ${input.lifeExpectancy} yrs · Pre-Ret. Inf. ${input.preRetInflation}% · Kitty Return ${input.postRetReturn}%`;
  const isSurplus = result.shortfallOrSurplus >= 0;

  return (
    <CalculatorFourSectionLayout
      onReset={() => setInput(DEFAULT_RETIREMENT_INPUT)}
      inputs={
        <>
          <SliderField
            id="ret-present-age"
            label="Present Age"
            value={input.presentAge}
            onChange={(v) =>
              setInput((prev) => ({
                ...prev,
                presentAge: v,
                retirementAge: Math.max(v + 1, prev.retirementAge),
                lifeExpectancy: Math.max(
                  Math.max(v + 1, prev.retirementAge) + 1,
                  prev.lifeExpectancy,
                ),
              }))
            }
            min={18}
            max={70}
            step={1}
            unit="Yrs"
          />

          <SliderField
            id="ret-age"
            label="Retirement Age"
            value={input.retirementAge}
            onChange={(v) =>
              setInput((prev) => ({
                ...prev,
                retirementAge: Math.max(prev.presentAge + 1, v),
                lifeExpectancy: Math.max(
                  Math.max(prev.presentAge + 1, v) + 1,
                  prev.lifeExpectancy,
                ),
              }))
            }
            min={Math.min(79, input.presentAge + 1)}
            max={80}
            step={1}
            unit="Yrs"
          />

          <AmountField
            id="ret-expenses"
            label="Current Monthly Household Expenses"
            value={input.monthlyExpenses}
            onChange={(v) => setInput((prev) => ({ ...prev, monthlyExpenses: v }))}
            sliderMin={10000}
            sliderMax={300000}
            maxAllowed={5000000}
            step={5000}
          />

          <SliderField
            id="ret-return"
            label="Expected Pre-Retirement Returns"
            value={input.expectedReturn}
            onChange={(v) => setInput((prev) => ({ ...prev, expectedReturn: v }))}
            min={4}
            max={20}
            step={0.5}
            unit="% p.a."
            accent="growth"
          />

          <StepUpControl
            value={input.stepUp}
            onChange={(stepUp) => setInput((prev) => ({ ...prev, stepUp }))}
          />

          <ExistingInvestmentsControl
            amount={input.existingAmount}
            returnRate={input.existingReturn}
            onAmountChange={(existingAmount) =>
              setInput((prev) => ({ ...prev, existingAmount }))
            }
            onReturnChange={(existingReturn) =>
              setInput((prev) => ({ ...prev, existingReturn }))
            }
          />

          <ExpandableSection title="Assumptions" summary={assumptionsSummary}>
            <div className="flex flex-col gap-4">
              <SliderField
                id="ret-life-exp"
                label="Life Expectancy"
                value={input.lifeExpectancy}
                onChange={(v) =>
                  setInput((prev) => ({
                    ...prev,
                    lifeExpectancy: Math.max(prev.retirementAge + 1, v),
                  }))
                }
                min={Math.min(99, input.retirementAge + 1)}
                max={100}
                step={1}
                unit="Yrs"
              />
              <SliderField
                id="ret-pre-inf"
                label="Pre-Retirement Inflation (p.a.)"
                value={input.preRetInflation}
                onChange={(v) => setInput((prev) => ({ ...prev, preRetInflation: v }))}
                min={0}
                max={15}
                step={0.5}
                unit="%"
              />
              <SliderField
                id="ret-post-ret"
                label="Returns on Retirement Kitty"
                value={input.postRetReturn}
                onChange={(v) => setInput((prev) => ({ ...prev, postRetReturn: v }))}
                min={2}
                max={15}
                step={0.5}
                unit="% p.a."
                accent="growth"
              />
              <SliderField
                id="ret-post-inf"
                label="Post-Retirement Inflation (p.a.)"
                value={input.postRetInflation}
                onChange={(v) => setInput((prev) => ({ ...prev, postRetInflation: v }))}
                min={0}
                max={15}
                step={0.5}
                unit="%"
              />
            </div>
          </ExpandableSection>
        </>
      }
      results={
        <>
          <KpiCard
            size="hero"
            label="Recommended Retirement Kitty"
            value={formatINR(result.recommendedKitty)}
            subtext={`${formatCompactINR(result.recommendedKitty)} required at age ${input.retirementAge}`}
            tone="primary"
          />

          <ThreeWayInvestmentStrip
            monthly={result.requiredMonthly}
            yearly={result.requiredYearly}
            oneTime={result.requiredOneTime}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <KpiCard
              size="large"
              label="Monthly Expenses at Retirement"
              value={formatINR(result.monthlyExpensesAtRetirement)}
              subtext={`At ${input.preRetInflation}% inflation over ${result.yearsToRetire} yrs`}
              tone="neutral"
            />
            <KpiCard
              size="large"
              label="Existing Investments FV"
              value={formatINR(result.existingFV)}
              subtext={
                input.existingAmount > 0
                  ? `${formatINR(input.existingAmount)} @ ${input.existingReturn}% p.a.`
                  : 'No existing allocation entered'
              }
              tone="growth"
            />
          </div>

          <KpiCard
            size="default"
            label={isSurplus ? 'Surplus Above Target' : 'Shortfall to Target Kitty'}
            value={formatINR(result.shortfallOrSurplus)}
            subtext={
              isSurplus
                ? 'Existing corpus covers your retirement goal'
                : 'Funded via the Monthly / Yearly / One-Time plan above'
            }
            tone={isSurplus ? 'growth' : 'warning'}
          />
        </>
      }
      chartTitle="Retirement Corpus Lifecycle"
      legendItems={[
        { label: 'Projected Corpus', color: '#0B2E8A' },
        { label: `Retirement Age (${input.retirementAge})`, color: '#38982B', dashed: true },
      ]}
      chartNode={
        <ChartContainer
          ariaLabel={`Retirement corpus lifecycle projection from age ${input.presentAge} to ${input.lifeExpectancy}, peaking at ${formatINR(result.recommendedKitty)}`}
          fallbackText={formatCompactINR(result.recommendedKitty)}
        >
          <AreaChart
            data={result.lifecycleRows}
            margin={{ top: 12, right: 12, left: 4, bottom: 0 }}
          >
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <XAxis
              dataKey="age"
              tick={{ fontSize: 12, fill: '#475569' }}
              tickFormatter={(val) => `Age ${val}`}
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#475569' }}
              width={76}
              tickFormatter={(val) => formatCompactINR(Number(val))}
            />
            <Tooltip
              formatter={(value) => [
                formatINR(Number(value ?? 0)),
                'Projected Corpus',
              ]}
              labelFormatter={(label) => `Age ${label}`}
            />
            <ReferenceLine
              x={input.retirementAge}
              stroke="#38982B"
              strokeDasharray="5 4"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="corpusValue"
              stroke="#0B2E8A"
              strokeWidth={2.5}
              fill="#0B2E8A"
              fillOpacity={0.14}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      }
      table={{
        id: 'retirement-lifecycle-table',
        title: 'Age-by-Age Lifecycle Schedule',
        headers: ['Age', 'Phase', 'Corpus Balance', 'Invested / Drawdown'],
        rows: result.lifecycleRows.map((row) => ({
          key: row.age,
          cells: [
            `Age ${row.age}`,
            row.phase,
            formatINR(row.corpusValue),
            formatINR(row.annualExpenseOrInvested),
          ],
          highlightCol: 2,
        })),
      }}
    />
  );
}

function StandardLifeGoalCalculator({
  slug,
  title,
  defaultInput,
  showGoalName = false,
}: {
  slug: Exclude<LifeGoalSlug, 'retirement'>;
  title: string;
  defaultInput: LifeGoalInput;
  showGoalName?: boolean;
}) {
  const [input, setInput] = React.useState<LifeGoalInput>(defaultInput);
  const result = React.useMemo(() => calculateLifeGoal(input), [input]);
  const isSurplus = result.shortfallOrSurplus >= 0;

  const displayTitle =
    showGoalName && input.goalName?.trim() ? input.goalName.trim() : title;

  return (
    <CalculatorFourSectionLayout
      onReset={() => setInput(defaultInput)}
      inputs={
        <>
          {showGoalName && (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${slug}-goal-name`}
                className="text-sm font-semibold text-[var(--color-foreground)]"
              >
                Goal Name
              </label>
              <input
                id={`${slug}-goal-name`}
                type="text"
                maxLength={60}
                placeholder="e.g., Dream Home, Foreign Vacation"
                value={input.goalName ?? ''}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, goalName: e.target.value }))
                }
                className="min-h-[44px] w-full rounded-lg border-[1.5px] border-[var(--color-border-input)] bg-[var(--color-card)] px-3 py-2 text-sm font-semibold text-[var(--color-secondary)] focus-visible:border-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
              />
            </div>
          )}

          <SliderField
            id={`${slug}-years`}
            label="Years Remaining to Goal"
            value={input.yearsRemaining}
            onChange={(v) => setInput((prev) => ({ ...prev, yearsRemaining: v }))}
            min={1}
            max={50}
            step={1}
            unit="Yrs"
          />

          <AmountField
            id={`${slug}-cost`}
            label="Estimated Cost Today"
            value={input.costToday}
            onChange={(v) => setInput((prev) => ({ ...prev, costToday: v }))}
            sliderMin={100000}
            sliderMax={25000000}
            maxAllowed={500000000}
            step={100000}
          />

          <SliderField
            id={`${slug}-inflation`}
            label="Expected Inflation"
            value={input.inflation}
            onChange={(v) => setInput((prev) => ({ ...prev, inflation: v }))}
            min={0}
            max={15}
            step={0.5}
            unit="% p.a."
          />

          <SliderField
            id={`${slug}-return`}
            label="Expected Investment Returns"
            value={input.expectedReturn}
            onChange={(v) => setInput((prev) => ({ ...prev, expectedReturn: v }))}
            min={5}
            max={20}
            step={0.5}
            unit="% p.a."
            accent="growth"
          />

          <StepUpControl
            value={input.stepUp}
            onChange={(stepUp) => setInput((prev) => ({ ...prev, stepUp }))}
          />

          <ExistingInvestmentsControl
            amount={input.existingAmount}
            returnRate={input.existingReturn}
            onAmountChange={(existingAmount) =>
              setInput((prev) => ({ ...prev, existingAmount }))
            }
            onReturnChange={(existingReturn) =>
              setInput((prev) => ({ ...prev, existingReturn }))
            }
          />
        </>
      }
      results={
        <>
          <KpiCard
            size="hero"
            label={`Recommended Target (${displayTitle})`}
            value={formatINR(result.targetAmount)}
            subtext={`${formatCompactINR(result.targetAmount)} after ${input.yearsRemaining} yrs @ ${input.inflation}% inflation`}
            tone="primary"
          />

          <ThreeWayInvestmentStrip
            monthly={result.requiredMonthly}
            yearly={result.requiredYearly}
            oneTime={result.requiredOneTime}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <KpiCard
              size="large"
              label="Future Value of Existing"
              value={formatINR(result.existingFV)}
              subtext={
                input.existingAmount > 0
                  ? `${formatINR(input.existingAmount)} @ ${input.existingReturn}% p.a.`
                  : 'No existing corpus allocated'
              }
              tone="growth"
            />
            <KpiCard
              size="large"
              label={isSurplus ? 'Surplus Above Goal' : 'Shortfall to Target'}
              value={formatINR(result.shortfallOrSurplus)}
              subtext={
                isSurplus
                  ? 'Existing corpus meets the goal'
                  : 'Cover via investment plan above'
              }
              tone={isSurplus ? 'growth' : 'warning'}
            />
          </div>
        </>
      }
      chartTitle={`${displayTitle} Trajectory`}
      legendItems={[
        { label: 'Invested', color: '#0B2E8A' },
        { label: 'Projected Wealth', color: '#38982B' },
        { label: 'Inflated Goal', color: '#926207', dashed: true },
      ]}
      chartNode={
        <ChartContainer
          ariaLabel={`${displayTitle} projection reaching ${formatINR(result.targetAmount)} in ${input.yearsRemaining} years`}
          fallbackText={formatCompactINR(result.targetAmount)}
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
                  ? 'Invested Capital'
                  : name === 'totalProjected'
                    ? 'Projected Wealth'
                    : 'Inflated Goal Cost',
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
              dataKey="totalProjected"
              stroke="#38982B"
              strokeWidth={2.5}
              fill="#38982B"
              fillOpacity={0.14}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="inflatedGoal"
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
        id: `${slug}-yearly-table`,
        title: 'Year-by-Year Goal Schedule',
        headers: ['Year', 'Invested Capital', 'Projected Wealth', 'Inflated Goal'],
        rows: result.yearlyRows.map((row) => ({
          key: row.year,
          cells: [
            `Yr ${row.year}`,
            formatINR(row.invested),
            formatINR(row.totalProjected),
            formatINR(row.inflatedGoal),
          ],
          highlightCol: 2,
        })),
      }}
    />
  );
}

export function LifeGoalCalculators({ activeSlug }: { activeSlug: LifeGoalSlug }) {
  return (
    <div className={cn('w-full')}>
      {activeSlug === 'retirement' && <PlanYourRetirementCalculator />}
      {activeSlug === 'child-education' && (
        <StandardLifeGoalCalculator
          key="child-education"
          slug="child-education"
          title="Child Education"
          defaultInput={DEFAULT_CHILD_EDUCATION_INPUT}
        />
      )}
      {activeSlug === 'child-marriage' && (
        <StandardLifeGoalCalculator
          key="child-marriage"
          slug="child-marriage"
          title="Marriage For Child"
          defaultInput={DEFAULT_MARRIAGE_INPUT}
        />
      )}
      {activeSlug === 'other-goal' && (
        <StandardLifeGoalCalculator
          key="other-goal"
          slug="other-goal"
          title="Your Other Goal"
          defaultInput={DEFAULT_OTHER_GOAL_INPUT}
          showGoalName
        />
      )}
    </div>
  );
}
