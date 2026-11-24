/**
 * Pure financial calculation engine for all 12 Right Investment calculators
 * across Life Goal Calculators, Financial Calculators, and Quick Tools.
 *
 * Conventions follow NJ Wealth's verified compounding standards:
 * - Effective monthly rate: (1 + R/100)^(1/12) - 1 for SIP, SWP, and Goal calculators.
 * - Annuity-due (beginning-of-month) contributions for SIP & Life Goal projections.
 * - Nominal monthly rate: (R/100) / 12 for EMI loan amortization.
 */

export type StepUpMode =
  | 'none'
  | 'percentYearly'
  | 'halfYearlyRupee'
  | 'yearlyRupee';

export interface StepUpConfig {
  mode: StepUpMode;
  value: number;
}

export const DEFAULT_STEP_UP: StepUpConfig = {
  mode: 'none',
  value: 0,
};

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  if (!Number.isFinite(amount)) return '₹0';
  const rounded = Math.round(amount);
  if (rounded < 0) {
    return `-${inrFormatter.format(Math.abs(rounded))}`;
  }
  return inrFormatter.format(rounded);
}

export function formatCompactINR(amount: number): string {
  if (!Number.isFinite(amount)) return '₹0';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 1_00_00_000) {
    return `${sign}₹${(abs / 1_00_00_000).toFixed(2)} Cr`;
  }
  if (abs >= 1_00_000) {
    return `${sign}₹${(abs / 1_00_000).toFixed(2)} Lakh`;
  }
  return formatINR(amount);
}

export function effectiveMonthlyRate(annualRatePercent: number): number {
  if (!Number.isFinite(annualRatePercent) || annualRatePercent <= 0) return 0;
  return Math.pow(1 + annualRatePercent / 100, 1 / 12) - 1;
}

export function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function getMonthlyContribution(
  baseMonthly: number,
  monthIndex: number,
  stepUp: StepUpConfig,
): number {
  const safeVal = Math.max(0, Number.isFinite(stepUp.value) ? stepUp.value : 0);
  const yearIdx = Math.floor(monthIndex / 12);
  const halfIdx = Math.floor(monthIndex / 6);

  switch (stepUp.mode) {
    case 'percentYearly':
      return baseMonthly * Math.pow(1 + safeVal / 100, yearIdx);
    case 'halfYearlyRupee':
      return Math.max(0, baseMonthly + safeVal * halfIdx);
    case 'yearlyRupee':
      return Math.max(0, baseMonthly + safeVal * yearIdx);
    case 'none':
    default:
      return baseMonthly;
  }
}

export interface SipSimulationRow {
  year: number;
  invested: number;
  estimatedValue: number;
  wealthGain: number;
  monthlySipAtYearEnd: number;
}

export interface SipSimulationResult {
  totalInvested: number;
  estimatedValue: number;
  wealthGain: number;
  yearlyRows: SipSimulationRow[];
}

export function simulateSipWithStepUp(
  baseMonthly: number,
  annualReturnPercent: number,
  years: number,
  stepUp: StepUpConfig = DEFAULT_STEP_UP,
): SipSimulationResult {
  const safeYears = Math.max(1, Math.round(years));
  const totalMonths = safeYears * 12;
  const r = effectiveMonthlyRate(annualReturnPercent);

  let balance = 0;
  let invested = 0;
  let lastSip = baseMonthly;
  const yearlyRows: SipSimulationRow[] = [];

  for (let m = 0; m < totalMonths; m += 1) {
    const sip = getMonthlyContribution(baseMonthly, m, stepUp);
    lastSip = sip;
    invested += sip;
    balance = (balance + sip) * (1 + r);

    if ((m + 1) % 12 === 0) {
      const year = (m + 1) / 12;
      const roundedInvested = Math.round(invested);
      const roundedValue = Math.round(balance);
      yearlyRows.push({
        year,
        invested: roundedInvested,
        estimatedValue: roundedValue,
        wealthGain: Math.max(0, roundedValue - roundedInvested),
        monthlySipAtYearEnd: Math.round(lastSip),
      });
    }
  }

  return {
    totalInvested: invested,
    estimatedValue: balance,
    wealthGain: Math.max(0, balance - invested),
    yearlyRows,
  };
}

function simulateAnnualDueFV(
  baseYearly: number,
  annualReturnPercent: number,
  years: number,
  stepUp: StepUpConfig,
): number {
  const safeYears = Math.max(1, Math.round(years));
  const r = Math.max(0, annualReturnPercent) / 100;
  const safeVal = Math.max(0, Number.isFinite(stepUp.value) ? stepUp.value : 0);

  let balance = 0;
  for (let y = 0; y < safeYears; y += 1) {
    let contribution = baseYearly;
    if (stepUp.mode === 'percentYearly') {
      contribution = baseYearly * Math.pow(1 + safeVal / 100, y);
    } else if (stepUp.mode === 'halfYearlyRupee') {
      contribution = Math.max(0, baseYearly + safeVal * 2 * y);
    } else if (stepUp.mode === 'yearlyRupee') {
      contribution = Math.max(0, baseYearly + safeVal * y);
    }
    balance = (balance + contribution) * (1 + r);
  }
  return balance;
}

export interface GoalInvestments {
  requiredMonthly: number;
  requiredYearly: number;
  requiredOneTime: number;
}

export function solveGoalInvestments(
  netTarget: number,
  years: number,
  annualReturnPercent: number,
  stepUp: StepUpConfig = DEFAULT_STEP_UP,
): GoalInvestments {
  if (!Number.isFinite(netTarget) || netTarget <= 0) {
    return { requiredMonthly: 0, requiredYearly: 0, requiredOneTime: 0 };
  }
  const safeYears = Math.max(1, Math.round(years));
  const safeReturn = Math.max(0, annualReturnPercent);

  let requiredMonthly = 0;
  if (stepUp.mode === 'none' || stepUp.mode === 'percentYearly') {
    const unitFV = simulateSipWithStepUp(1, safeReturn, safeYears, stepUp).estimatedValue;
    requiredMonthly = unitFV > 0 ? netTarget / unitFV : netTarget / (safeYears * 12);
  } else {
    const incrementFV = simulateSipWithStepUp(0, safeReturn, safeYears, stepUp).estimatedValue;
    const baseUnitFV = simulateSipWithStepUp(1, safeReturn, safeYears, DEFAULT_STEP_UP).estimatedValue;
    requiredMonthly =
      baseUnitFV > 0 ? Math.max(0, (netTarget - incrementFV) / baseUnitFV) : 0;
  }

  let requiredYearly = 0;
  if (stepUp.mode === 'none' || stepUp.mode === 'percentYearly') {
    const unitYearlyFV = simulateAnnualDueFV(1, safeReturn, safeYears, stepUp);
    requiredYearly = unitYearlyFV > 0 ? netTarget / unitYearlyFV : netTarget / safeYears;
  } else {
    const incrementYearlyFV = simulateAnnualDueFV(0, safeReturn, safeYears, stepUp);
    const baseUnitYearlyFV = simulateAnnualDueFV(1, safeReturn, safeYears, DEFAULT_STEP_UP);
    requiredYearly =
      baseUnitYearlyFV > 0
        ? Math.max(0, (netTarget - incrementYearlyFV) / baseUnitYearlyFV)
        : 0;
  }

  const requiredOneTime = netTarget / Math.pow(1 + safeReturn / 100, safeYears);

  return {
    requiredMonthly,
    requiredYearly,
    requiredOneTime,
  };
}

// ============================================================================
// 1. Plan Your Retirement
// ============================================================================

export interface RetirementInput {
  presentAge: number;
  retirementAge: number;
  monthlyExpenses: number;
  expectedReturn: number;
  stepUp: StepUpConfig;
  existingAmount: number;
  existingReturn: number;
  lifeExpectancy: number;
  preRetInflation: number;
  postRetReturn: number;
  postRetInflation: number;
}

export interface RetirementLifecycleRow {
  age: number;
  year: number;
  phase: 'Accumulation' | 'Retirement';
  corpusValue: number;
  annualExpenseOrInvested: number;
}

export interface RetirementResult {
  yearsToRetire: number;
  yearsInRetirement: number;
  monthlyExpensesAtRetirement: number;
  recommendedKitty: number;
  existingFV: number;
  shortfallOrSurplus: number;
  requiredMonthly: number;
  requiredYearly: number;
  requiredOneTime: number;
  lifecycleRows: RetirementLifecycleRow[];
}

export const DEFAULT_RETIREMENT_INPUT: RetirementInput = {
  presentAge: 30,
  retirementAge: 60,
  monthlyExpenses: 50000,
  expectedReturn: 12,
  stepUp: { mode: 'none', value: 0 },
  existingAmount: 0,
  existingReturn: 12,
  lifeExpectancy: 85,
  preRetInflation: 6,
  postRetReturn: 8,
  postRetInflation: 6,
};

export function calculateRetirementPlan(input: RetirementInput): RetirementResult {
  const presentAge = clampNumber(Math.round(input.presentAge), 18, 75);
  const retirementAge = clampNumber(Math.round(input.retirementAge), presentAge + 1, 85);
  const lifeExpectancy = clampNumber(Math.round(input.lifeExpectancy), retirementAge + 1, 100);
  const monthlyExpenses = Math.max(0, input.monthlyExpenses);
  const expectedReturn = clampNumber(input.expectedReturn, 0, 30);
  const existingAmount = Math.max(0, input.existingAmount);
  const existingReturn = clampNumber(input.existingReturn, 0, 30);
  const preRetInflation = clampNumber(input.preRetInflation, 0, 20);
  const postRetReturn = clampNumber(input.postRetReturn, 0, 20);
  const postRetInflation = clampNumber(input.postRetInflation, 0, 20);

  const yearsToRetire = retirementAge - presentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;

  const monthlyExpensesAtRetirement =
    monthlyExpenses * Math.pow(1 + preRetInflation / 100, yearsToRetire);

  const rPostM = effectiveMonthlyRate(postRetReturn);
  const iPostM = effectiveMonthlyRate(postRetInflation);
  const realRateM = (1 + rPostM) / (1 + iPostM) - 1;
  const retMonths = yearsInRetirement * 12;

  let recommendedKitty = 0;
  if (Math.abs(realRateM) < 1e-9) {
    recommendedKitty = monthlyExpensesAtRetirement * retMonths;
  } else {
    recommendedKitty =
      monthlyExpensesAtRetirement *
      ((1 - Math.pow(1 + realRateM, -retMonths)) / realRateM) *
      (1 + realRateM);
  }

  const existingFV = existingAmount * Math.pow(1 + existingReturn / 100, yearsToRetire);
  const shortfallOrSurplus = existingFV - recommendedKitty;
  const netTarget = Math.max(0, recommendedKitty - existingFV);

  const solved = solveGoalInvestments(netTarget, yearsToRetire, expectedReturn, input.stepUp);

  // Build age-by-age accumulation & drawdown curve
  const lifecycleRows: RetirementLifecycleRow[] = [];
  const rPreM = effectiveMonthlyRate(expectedReturn);
  const rExistM = effectiveMonthlyRate(existingReturn);
  let sipBalance = 0;
  let existBalance = existingAmount;
  let cumulativeInvested = existingAmount;

  for (let m = 0; m < yearsToRetire * 12; m += 1) {
    const sip = getMonthlyContribution(solved.requiredMonthly, m, input.stepUp);
    cumulativeInvested += sip;
    sipBalance = (sipBalance + sip) * (1 + rPreM);
    existBalance = existBalance * (1 + rExistM);

    if ((m + 1) % 12 === 0) {
      const yr = (m + 1) / 12;
      lifecycleRows.push({
        age: presentAge + yr,
        year: yr,
        phase: 'Accumulation',
        corpusValue: Math.round(sipBalance + existBalance),
        annualExpenseOrInvested: Math.round(cumulativeInvested),
      });
    }
  }

  // Drawdown phase starts from total corpus at retirement (or recommendedKitty if surplus)
  let postBalance = Math.max(recommendedKitty, sipBalance + existBalance);
  let currentMonthlyExpense = monthlyExpensesAtRetirement;

  for (let y = 1; y <= yearsInRetirement; y += 1) {
    let yearlyDrawdown = 0;
    for (let m = 0; m < 12; m += 1) {
      const withdrawal = Math.min(postBalance, currentMonthlyExpense);
      yearlyDrawdown += withdrawal;
      postBalance = Math.max(0, (postBalance - withdrawal) * (1 + rPostM));
      currentMonthlyExpense = currentMonthlyExpense * (1 + iPostM);
    }
    lifecycleRows.push({
      age: retirementAge + y,
      year: yearsToRetire + y,
      phase: 'Retirement',
      corpusValue: Math.round(postBalance),
      annualExpenseOrInvested: Math.round(yearlyDrawdown),
    });
  }

  return {
    yearsToRetire,
    yearsInRetirement,
    monthlyExpensesAtRetirement: Math.round(monthlyExpensesAtRetirement),
    recommendedKitty: Math.round(recommendedKitty),
    existingFV: Math.round(existingFV),
    shortfallOrSurplus: Math.round(shortfallOrSurplus),
    requiredMonthly: Math.round(solved.requiredMonthly),
    requiredYearly: Math.round(solved.requiredYearly),
    requiredOneTime: Math.round(solved.requiredOneTime),
    lifecycleRows,
  };
}

// ============================================================================
// 2, 3, 4. Child Education, Marriage For Child, Your Other Goal
// ============================================================================

export interface LifeGoalInput {
  goalName?: string;
  yearsRemaining: number;
  costToday: number;
  inflation: number;
  expectedReturn: number;
  stepUp: StepUpConfig;
  existingAmount: number;
  existingReturn: number;
}

export interface LifeGoalYearlyRow {
  year: number;
  invested: number;
  existingValue: number;
  totalProjected: number;
  inflatedGoal: number;
}

export interface LifeGoalResult {
  targetAmount: number;
  existingFV: number;
  shortfallOrSurplus: number;
  requiredMonthly: number;
  requiredYearly: number;
  requiredOneTime: number;
  yearlyRows: LifeGoalYearlyRow[];
}

export const DEFAULT_CHILD_EDUCATION_INPUT: LifeGoalInput = {
  yearsRemaining: 25,
  costToday: 5000000,
  inflation: 10,
  expectedReturn: 12,
  stepUp: { mode: 'none', value: 0 },
  existingAmount: 0,
  existingReturn: 12,
};

export const DEFAULT_MARRIAGE_INPUT: LifeGoalInput = {
  yearsRemaining: 25,
  costToday: 5000000,
  inflation: 8,
  expectedReturn: 12,
  stepUp: { mode: 'none', value: 0 },
  existingAmount: 0,
  existingReturn: 12,
};

export const DEFAULT_OTHER_GOAL_INPUT: LifeGoalInput = {
  goalName: 'Dream Home',
  yearsRemaining: 25,
  costToday: 10000000,
  inflation: 8,
  expectedReturn: 12,
  stepUp: { mode: 'none', value: 0 },
  existingAmount: 0,
  existingReturn: 12,
};

export function calculateLifeGoal(input: LifeGoalInput): LifeGoalResult {
  const years = clampNumber(Math.round(input.yearsRemaining), 1, 50);
  const costToday = Math.max(0, input.costToday);
  const inflation = clampNumber(input.inflation, 0, 20);
  const expectedReturn = clampNumber(input.expectedReturn, 0, 30);
  const existingAmount = Math.max(0, input.existingAmount);
  const existingReturn = clampNumber(input.existingReturn, 0, 30);

  const targetAmount = costToday * Math.pow(1 + inflation / 100, years);
  const existingFV = existingAmount * Math.pow(1 + existingReturn / 100, years);
  const shortfallOrSurplus = existingFV - targetAmount;
  const netTarget = Math.max(0, targetAmount - existingFV);

  const solved = solveGoalInvestments(netTarget, years, expectedReturn, input.stepUp);
  const sipSim = simulateSipWithStepUp(
    solved.requiredMonthly,
    expectedReturn,
    years,
    input.stepUp,
  );

  const yearlyRows: LifeGoalYearlyRow[] = sipSim.yearlyRows.map((row) => {
    const existingVal = Math.round(
      existingAmount * Math.pow(1 + existingReturn / 100, row.year),
    );
    const inflatedGoal = Math.round(
      costToday * Math.pow(1 + inflation / 100, row.year),
    );
    return {
      year: row.year,
      invested: row.invested + Math.round(existingAmount),
      existingValue: existingVal,
      totalProjected: row.estimatedValue + existingVal,
      inflatedGoal,
    };
  });

  return {
    targetAmount: Math.round(targetAmount),
    existingFV: Math.round(existingFV),
    shortfallOrSurplus: Math.round(shortfallOrSurplus),
    requiredMonthly: Math.round(solved.requiredMonthly),
    requiredYearly: Math.round(solved.requiredYearly),
    requiredOneTime: Math.round(solved.requiredOneTime),
    yearlyRows,
  };
}

// ============================================================================
// 5. SIP Growth
// ============================================================================

export interface SipGrowthInput {
  monthlyInvestment: number;
  years: number;
  expectedReturn: number;
  stepUp: StepUpConfig;
}

export interface SipGrowthRow {
  year: number;
  invested: number;
  estimatedValue: number;
  wealthGain: number;
  baseSipValue: number;
}

export interface SipGrowthResult {
  estimatedFutureValue: number;
  totalInvested: number;
  wealthGain: number;
  growthMultiple: number;
  yearlyRows: SipGrowthRow[];
}

export const DEFAULT_SIP_GROWTH_INPUT: SipGrowthInput = {
  monthlyInvestment: 10000,
  years: 10,
  expectedReturn: 12,
  stepUp: { mode: 'none', value: 0 },
};

export function calculateSipGrowth(input: SipGrowthInput): SipGrowthResult {
  const monthly = Math.max(0, input.monthlyInvestment);
  const years = clampNumber(Math.round(input.years), 1, 50);
  const expectedReturn = clampNumber(input.expectedReturn, 0, 30);

  const sim = simulateSipWithStepUp(monthly, expectedReturn, years, input.stepUp);
  const baseSim =
    input.stepUp.mode === 'none'
      ? sim
      : simulateSipWithStepUp(monthly, expectedReturn, years, DEFAULT_STEP_UP);

  const growthMultiple =
    sim.totalInvested > 0 ? Number((sim.estimatedValue / sim.totalInvested).toFixed(2)) : 0;

  const yearlyRows: SipGrowthRow[] = sim.yearlyRows.map((row, idx) => ({
    year: row.year,
    invested: row.invested,
    estimatedValue: row.estimatedValue,
    wealthGain: row.wealthGain,
    baseSipValue: baseSim.yearlyRows[idx]?.estimatedValue ?? row.estimatedValue,
  }));

  return {
    estimatedFutureValue: Math.round(sim.estimatedValue),
    totalInvested: Math.round(sim.totalInvested),
    wealthGain: Math.round(sim.wealthGain),
    growthMultiple,
    yearlyRows,
  };
}

// ============================================================================
// 6. SIP Need
// ============================================================================

export interface SipNeedInput {
  targetAmountToday: number;
  years: number;
  expectedReturn: number;
  inflation: number;
  stepUp: StepUpConfig;
}

export interface SipNeedResult {
  requiredSipAmount: number;
  targetAmountRequired: number;
  projectedInvestment: number;
  estimatedGain: number;
  growthMultiple: number;
  yearlyRows: SipSimulationRow[];
}

export const DEFAULT_SIP_NEED_INPUT: SipNeedInput = {
  targetAmountToday: 10000000,
  years: 10,
  expectedReturn: 12,
  inflation: 8,
  stepUp: { mode: 'none', value: 0 },
};

export function calculateSipNeed(input: SipNeedInput): SipNeedResult {
  const targetToday = Math.max(0, input.targetAmountToday);
  const years = clampNumber(Math.round(input.years), 1, 50);
  const expectedReturn = clampNumber(input.expectedReturn, 0, 30);
  const inflation = clampNumber(input.inflation, 0, 20);

  const targetAmountRequired = targetToday * Math.pow(1 + inflation / 100, years);
  const solved = solveGoalInvestments(targetAmountRequired, years, expectedReturn, input.stepUp);
  const sim = simulateSipWithStepUp(
    solved.requiredMonthly,
    expectedReturn,
    years,
    input.stepUp,
  );

  const growthMultiple =
    sim.totalInvested > 0 ? Number((targetAmountRequired / sim.totalInvested).toFixed(2)) : 0;

  return {
    requiredSipAmount: Math.round(solved.requiredMonthly),
    targetAmountRequired: Math.round(targetAmountRequired),
    projectedInvestment: Math.round(sim.totalInvested),
    estimatedGain: Math.max(0, Math.round(targetAmountRequired - sim.totalInvested)),
    growthMultiple,
    yearlyRows: sim.yearlyRows,
  };
}

// ============================================================================
// 7. SIP Delay Cost
// ============================================================================

export interface SipDelayCostInput {
  monthlyInvestment: number;
  years: number;
  expectedReturn: number;
  delayMonths: number;
}

export interface SipDelayCostRow {
  year: number;
  withoutDelay: number;
  withDelay: number;
  gap: number;
}

export interface SipDelayCostResult {
  delayCost: number;
  fvWithoutDelay: number;
  fvWithDelay: number;
  investedWithoutDelay: number;
  investedWithDelay: number;
  yearlyRows: SipDelayCostRow[];
}

export const DEFAULT_SIP_DELAY_INPUT: SipDelayCostInput = {
  monthlyInvestment: 10000,
  years: 10,
  expectedReturn: 12,
  delayMonths: 1,
};

export function calculateSipDelayCost(input: SipDelayCostInput): SipDelayCostResult {
  const monthly = Math.max(0, input.monthlyInvestment);
  const years = clampNumber(Math.round(input.years), 1, 50);
  const expectedReturn = clampNumber(input.expectedReturn, 0, 30);
  const totalMonths = years * 12;
  const delayMonths = clampNumber(Math.round(input.delayMonths), 1, Math.max(1, totalMonths - 1));

  const r = effectiveMonthlyRate(expectedReturn);
  let balNoDelay = 0;
  let balWithDelay = 0;
  let invNoDelay = 0;
  let invWithDelay = 0;
  const yearlyRows: SipDelayCostRow[] = [];

  for (let m = 0; m < totalMonths; m += 1) {
    invNoDelay += monthly;
    balNoDelay = (balNoDelay + monthly) * (1 + r);

    if (m >= delayMonths) {
      invWithDelay += monthly;
      balWithDelay = (balWithDelay + monthly) * (1 + r);
    }

    if ((m + 1) % 12 === 0) {
      const noD = Math.round(balNoDelay);
      const withD = Math.round(balWithDelay);
      yearlyRows.push({
        year: (m + 1) / 12,
        withoutDelay: noD,
        withDelay: withD,
        gap: Math.max(0, noD - withD),
      });
    }
  }

  return {
    delayCost: Math.max(0, Math.round(balNoDelay - balWithDelay)),
    fvWithoutDelay: Math.round(balNoDelay),
    fvWithDelay: Math.round(balWithDelay),
    investedWithoutDelay: Math.round(invNoDelay),
    investedWithDelay: Math.round(invWithDelay),
    yearlyRows,
  };
}

// ============================================================================
// 8. SWP Calculator
// ============================================================================

export interface SwpInput {
  initialInvestment: number;
  monthlyWithdrawal: number;
  increaseYearly: boolean;
  yearlyIncreasePercent: number;
  expectedReturn: number;
  startAfterYears: number;
  horizonYears: number;
}

export interface SwpYearlyRow {
  year: number;
  remainingCorpus: number;
  cumulativeWithdrawn: number;
  yearlyWithdrawn: number;
}

export interface SwpResult {
  periodEndValue: number;
  totalWithdrawn: number;
  fullInstalmentsWithdrawn: number;
  lastInstalmentDateLabel: string;
  isPerpetual: boolean;
  estimatedFullLifeInstalments: number;
  yearlyRows: SwpYearlyRow[];
}

export const DEFAULT_SWP_INPUT: SwpInput = {
  initialInvestment: 2500000,
  monthlyWithdrawal: 10000,
  increaseYearly: false,
  yearlyIncreasePercent: 10,
  expectedReturn: 8,
  startAfterYears: 0,
  horizonYears: 15,
};

function formatFutureMonthLabel(monthsAhead: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsAhead);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function calculateSwp(input: SwpInput): SwpResult {
  const initial = Math.max(0, input.initialInvestment);
  const baseWithdrawal = Math.max(0, input.monthlyWithdrawal);
  const horizonYears = clampNumber(Math.round(input.horizonYears), 1, 50);
  const startAfterYears = clampNumber(
    Math.round(input.startAfterYears),
    0,
    Math.max(0, horizonYears - 1),
  );
  const expectedReturn = clampNumber(input.expectedReturn, 0, 25);
  const yearlyInc = input.increaseYearly
    ? clampNumber(input.yearlyIncreasePercent, 0, 20)
    : 0;

  const r = effectiveMonthlyRate(expectedReturn);
  let balance = initial;
  let totalWithdrawn = 0;
  let fullInstalments = 0;
  let lastFullMonthNumber = 0;
  const yearlyRows: SwpYearlyRow[] = [];

  const totalHorizonMonths = horizonYears * 12;
  const deferMonths = startAfterYears * 12;

  for (let m = 1; m <= totalHorizonMonths; m += 1) {
    // 1 month of growth happens prior to withdrawals starting ("starts after next month")
    if (m <= deferMonths) {
      balance = balance * (1 + r);
    } else {
      if (m === deferMonths + 1) {
        balance = balance * (1 + r);
      }
      const payoutIndex = m - deferMonths - 1;
      const w = input.increaseYearly
        ? baseWithdrawal * Math.pow(1 + yearlyInc / 100, Math.floor(payoutIndex / 12))
        : baseWithdrawal;

      if (balance >= w && w > 0) {
        balance = (balance - w) * (1 + r);
        totalWithdrawn += w;
        fullInstalments += 1;
        lastFullMonthNumber = m;
      } else if (balance > 0 && w > 0) {
        totalWithdrawn += balance;
        balance = 0;
      } else {
        balance = balance * (1 + r);
      }
    }

    if (m % 12 === 0) {
      const yr = m / 12;
      const prevCumulative =
        yearlyRows.length > 0 ? yearlyRows[yearlyRows.length - 1].cumulativeWithdrawn : 0;
      const roundedCum = Math.round(totalWithdrawn);
      yearlyRows.push({
        year: yr,
        remainingCorpus: Math.round(balance),
        cumulativeWithdrawn: roundedCum,
        yearlyWithdrawn: Math.max(0, roundedCum - prevCumulative),
      });
    }
  }

  // Estimate full life of SWP across up to 100 years (1200 payout months)
  let lifeBalance = initial * Math.pow(1 + r, deferMonths + 1);
  let lifeInstalments = 0;
  let isPerpetual = false;
  const maxCheckMonths = 1200;

  if (baseWithdrawal === 0) {
    isPerpetual = true;
    lifeInstalments = maxCheckMonths;
  } else {
    for (let k = 0; k < maxCheckMonths; k += 1) {
      const w = input.increaseYearly
        ? baseWithdrawal * Math.pow(1 + yearlyInc / 100, Math.floor(k / 12))
        : baseWithdrawal;
      if (lifeBalance >= w) {
        lifeBalance = (lifeBalance - w) * (1 + r);
        lifeInstalments += 1;
      } else {
        break;
      }
    }
    if (lifeInstalments >= maxCheckMonths && lifeBalance > 0) {
      isPerpetual = true;
    }
  }

  return {
    periodEndValue: Math.round(balance),
    totalWithdrawn: Math.round(totalWithdrawn),
    fullInstalmentsWithdrawn: fullInstalments,
    lastInstalmentDateLabel:
      fullInstalments > 0 ? formatFutureMonthLabel(lastFullMonthNumber) : 'N/A',
    isPerpetual,
    estimatedFullLifeInstalments: lifeInstalments,
    yearlyRows,
  };
}

// ============================================================================
// 9. EMI Calculator
// ============================================================================

export interface EmiInput {
  loanAmount: number;
  loanDurationYears: number;
  interestRate: number;
  checkAfterYears: number;
}

export interface EmiYearlyRow {
  year: number;
  outstandingBalance: number;
  principalPaidCumulative: number;
  interestPaidCumulative: number;
  totalPaidCumulative: number;
}

export interface EmiResult {
  monthlyEmi: number;
  totalPayable: number;
  totalInterest: number;
  checkAfterYears: number;
  outstandingAfterX: number | null;
  amountPaidTillDate: number | null;
  principalPaidTillDate: number | null;
  interestPaidTillDate: number | null;
  yearlyRows: EmiYearlyRow[];
}

export const DEFAULT_EMI_INPUT: EmiInput = {
  loanAmount: 5000000,
  loanDurationYears: 20,
  interestRate: 9,
  checkAfterYears: 0,
};

export function calculateEmi(input: EmiInput): EmiResult {
  const loanAmount = Math.max(0, input.loanAmount);
  const years = clampNumber(Math.round(input.loanDurationYears), 1, 50);
  const rate = clampNumber(input.interestRate, 0, 35);
  const checkAfterYears = clampNumber(Math.round(input.checkAfterYears), 0, years);

  const n = years * 12;
  const r = rate / 12 / 100;

  const monthlyEmi =
    r === 0
      ? loanAmount / n
      : (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const totalPayable = monthlyEmi * n;
  const totalInterest = Math.max(0, totalPayable - loanAmount);

  let balance = loanAmount;
  let principalCum = 0;
  let interestCum = 0;
  const yearlyRows: EmiYearlyRow[] = [];

  for (let m = 1; m <= n; m += 1) {
    const interestForMonth = balance * r;
    const principalForMonth = Math.min(balance, monthlyEmi - interestForMonth);
    balance = Math.max(0, balance - principalForMonth);
    principalCum += principalForMonth;
    interestCum += interestForMonth;

    if (m % 12 === 0) {
      yearlyRows.push({
        year: m / 12,
        outstandingBalance: Math.round(balance),
        principalPaidCumulative: Math.round(principalCum),
        interestPaidCumulative: Math.round(interestCum),
        totalPaidCumulative: Math.round(principalCum + interestCum),
      });
    }
  }

  let outstandingAfterX: number | null = null;
  let amountPaidTillDate: number | null = null;
  let principalPaidTillDate: number | null = null;
  let interestPaidTillDate: number | null = null;

  if (checkAfterYears > 0) {
    const snap = yearlyRows[checkAfterYears - 1];
    if (snap) {
      outstandingAfterX = snap.outstandingBalance;
      amountPaidTillDate = snap.totalPaidCumulative;
      principalPaidTillDate = snap.principalPaidCumulative;
      interestPaidTillDate = snap.interestPaidCumulative;
    }
  }

  return {
    monthlyEmi: Math.round(monthlyEmi),
    totalPayable: Math.round(totalPayable),
    totalInterest: Math.round(totalInterest),
    checkAfterYears,
    outstandingAfterX,
    amountPaidTillDate,
    principalPaidTillDate,
    interestPaidTillDate,
    yearlyRows,
  };
}

// ============================================================================
// 10. Single Amount (PV / FV)
// ============================================================================

export type TimeValueMode = 'pv' | 'fv';

export interface SingleAmountInput {
  mode: TimeValueMode;
  amount: number;
  afterYears: number;
  rate: number;
}

export interface SingleAmountRow {
  year: number;
  value: number;
}

export interface SingleAmountResult {
  resultAmount: number;
  differenceAmount: number;
  yearlyRows: SingleAmountRow[];
}

export const DEFAULT_SINGLE_AMOUNT_INPUT: SingleAmountInput = {
  mode: 'pv',
  amount: 100000,
  afterYears: 5,
  rate: 8,
};

export function calculateSingleAmount(input: SingleAmountInput): SingleAmountResult {
  const amount = Math.max(0, input.amount);
  const years = clampNumber(Math.round(input.afterYears), 1, 50);
  const rate = clampNumber(input.rate, 0, 50);
  const r = rate / 100;

  const resultAmount =
    input.mode === 'pv'
      ? amount / Math.pow(1 + r, years)
      : amount * Math.pow(1 + r, years);

  const yearlyRows: SingleAmountRow[] = [];
  for (let y = 0; y <= years; y += 1) {
    const val =
      input.mode === 'pv'
        ? amount / Math.pow(1 + r, y)
        : amount * Math.pow(1 + r, y);
    yearlyRows.push({ year: y, value: Math.round(val) });
  }

  return {
    resultAmount: Math.round(resultAmount),
    differenceAmount: Math.round(Math.abs(resultAmount - amount)),
    yearlyRows,
  };
}

// ============================================================================
// 11. Irregular Cash Flow
// ============================================================================

export interface CashFlowRowInput {
  id: string;
  amount: number;
  years: number;
}

export interface IrregularCashFlowInput {
  mode: TimeValueMode;
  rate: number;
  rows: CashFlowRowInput[];
}

export interface IrregularCashFlowComputedRow {
  id: string;
  label: string;
  amount: number;
  years: number;
  adjustedValue: number;
}

export interface IrregularCashFlowResult {
  totalNominal: number;
  totalAdjusted: number;
  differenceAmount: number;
  computedRows: IrregularCashFlowComputedRow[];
}

export const DEFAULT_IRREGULAR_CASH_FLOW_INPUT: IrregularCashFlowInput = {
  mode: 'pv',
  rate: 8,
  rows: [
    { id: 'cf-1', amount: 100000, years: 1 },
    { id: 'cf-2', amount: 100000, years: 2 },
    { id: 'cf-3', amount: 100000, years: 3 },
  ],
};

export function calculateIrregularCashFlow(
  input: IrregularCashFlowInput,
): IrregularCashFlowResult {
  const rate = clampNumber(input.rate, 0, 30);
  const r = rate / 100;

  let totalNominal = 0;
  let totalAdjusted = 0;

  const computedRows: IrregularCashFlowComputedRow[] = input.rows.map((row, index) => {
    const amt = Math.max(0, row.amount);
    const yrs = clampNumber(Math.round(row.years), 1, 50);
    const adjusted =
      input.mode === 'pv' ? amt / Math.pow(1 + r, yrs) : amt * Math.pow(1 + r, yrs);
    totalNominal += amt;
    totalAdjusted += adjusted;

    return {
      id: row.id,
      label: `Cash Flow #${index + 1} (Yr ${yrs})`,
      amount: Math.round(amt),
      years: yrs,
      adjustedValue: Math.round(adjusted),
    };
  });

  return {
    totalNominal: Math.round(totalNominal),
    totalAdjusted: Math.round(totalAdjusted),
    differenceAmount: Math.round(Math.abs(totalAdjusted - totalNominal)),
    computedRows,
  };
}

// ============================================================================
// 12. Weighted Average Returns
// ============================================================================

export interface WeightedAssetRowInput {
  id: string;
  label: string;
  amount: number;
  returnRate: number;
}

export interface WeightedAvgInput {
  afterYears: number;
  rows: WeightedAssetRowInput[];
}

export interface WeightedAssetComputedRow {
  id: string;
  label: string;
  amount: number;
  returnRate: number;
  weightPercent: number;
  futureValue: number;
}

export interface WeightedAvgResult {
  totalInvested: number;
  weightedAvgReturn: number;
  estimatedFutureValue: number;
  estimatedGain: number;
  computedRows: WeightedAssetComputedRow[];
  yearlyRows: { year: number; invested: number; portfolioValue: number }[];
}

export const DEFAULT_WEIGHTED_AVG_INPUT: WeightedAvgInput = {
  afterYears: 5,
  rows: [
    { id: 'wa-1', label: 'Equity / Growth', amount: 100000, returnRate: 12 },
    { id: 'wa-2', label: 'Hybrid / Balanced', amount: 100000, returnRate: 12 },
    { id: 'wa-3', label: 'Debt / Fixed Income', amount: 100000, returnRate: 12 },
  ],
};

export function calculateWeightedAverageReturns(
  input: WeightedAvgInput,
): WeightedAvgResult {
  const years = clampNumber(Math.round(input.afterYears), 1, 50);

  let totalInvested = 0;
  let weightedSum = 0;

  for (const row of input.rows) {
    const amt = Math.max(0, row.amount);
    const ret = clampNumber(row.returnRate, 0, 30);
    totalInvested += amt;
    weightedSum += amt * ret;
  }

  const weightedAvgReturn = totalInvested > 0 ? weightedSum / totalInvested : 0;
  const estimatedFutureValue =
    totalInvested * Math.pow(1 + weightedAvgReturn / 100, years);

  const computedRows: WeightedAssetComputedRow[] = input.rows.map((row, idx) => {
    const amt = Math.max(0, row.amount);
    const ret = clampNumber(row.returnRate, 0, 30);
    const weightPercent = totalInvested > 0 ? (amt / totalInvested) * 100 : 0;
    const futureValue = amt * Math.pow(1 + ret / 100, years);
    return {
      id: row.id,
      label: row.label.trim() || `Asset ${idx + 1}`,
      amount: Math.round(amt),
      returnRate: ret,
      weightPercent: Number(weightPercent.toFixed(1)),
      futureValue: Math.round(futureValue),
    };
  });

  const yearlyRows: { year: number; invested: number; portfolioValue: number }[] = [];
  for (let y = 0; y <= years; y += 1) {
    yearlyRows.push({
      year: y,
      invested: Math.round(totalInvested),
      portfolioValue: Math.round(
        totalInvested * Math.pow(1 + weightedAvgReturn / 100, y),
      ),
    });
  }

  return {
    totalInvested: Math.round(totalInvested),
    weightedAvgReturn: Number(weightedAvgReturn.toFixed(2)),
    estimatedFutureValue: Math.round(estimatedFutureValue),
    estimatedGain: Math.max(0, Math.round(estimatedFutureValue - totalInvested)),
    computedRows,
    yearlyRows,
  };
}
