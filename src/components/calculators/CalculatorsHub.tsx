'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowsDownUp,
  ChartPieSlice,
  ClockCountdown,
  Crosshair,
  CurrencyInr,
  GraduationCap,
  Heart,
  HouseLine,
  ListNumbers,
  PiggyBank,
  Target,
  TrendUp,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import {
  FinancialCalculators,
  type FinancialSlug,
} from './FinancialCalculators';
import {
  LifeGoalCalculators,
  type LifeGoalSlug,
} from './LifeGoalCalculators';
import {
  QuickToolsCalculators,
  type QuickToolSlug,
} from './QuickToolsCalculators';

type CategoryKey = 'life-goals' | 'financial' | 'quick-tools';

type CalculatorSlug = LifeGoalSlug | FinancialSlug | QuickToolSlug;

interface CalculatorItem {
  slug: CalculatorSlug;
  category: CategoryKey;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ size?: number; weight?: 'regular' | 'bold' | 'fill'; className?: string; 'aria-hidden'?: boolean }>;
}

const CATEGORIES: Array<{
  key: CategoryKey;
  label: string;
  count: number;
  description: string;
}> = [
  {
    key: 'life-goals',
    label: 'Life Goal Calculators',
    count: 4,
    description:
      'Plan inflation-adjusted family milestones with Step-Up SIPs and existing savings.',
  },
  {
    key: 'financial',
    label: 'Financial Calculators',
    count: 5,
    description:
      'Model SIP growth, goal SIP need, cost of delaying, SWP longevity, and loan EMIs.',
  },
  {
    key: 'quick-tools',
    label: 'Quick Tools',
    count: 3,
    description:
      'Evaluate time value of money, irregular cash flows, and blended portfolio returns.',
  },
];

const CALCULATORS: CalculatorItem[] = [
  // Life Goal Calculators (4)
  {
    slug: 'retirement',
    category: 'life-goals',
    title: 'Plan Your Retirement',
    subtitle: 'Retirement kitty & post-retirement monthly drawdown',
    Icon: PiggyBank,
  },
  {
    slug: 'child-education',
    category: 'life-goals',
    title: 'Child Education',
    subtitle: 'Education inflation-adjusted corpus & SIP options',
    Icon: GraduationCap,
  },
  {
    slug: 'child-marriage',
    category: 'life-goals',
    title: 'Marriage For Child',
    subtitle: 'Long-term family celebration goal planner',
    Icon: Heart,
  },
  {
    slug: 'other-goal',
    category: 'life-goals',
    title: 'Your Other Goal',
    subtitle: 'Custom goal name, horizon & funding options',
    Icon: Target,
  },
  // Financial Calculators (5)
  {
    slug: 'sip-growth',
    category: 'financial',
    title: 'SIP Growth',
    subtitle: 'Future value & growth multiple with optional Step-Up',
    Icon: TrendUp,
  },
  {
    slug: 'sip-need',
    category: 'financial',
    title: 'SIP Need',
    subtitle: 'Exact monthly SIP required for an inflation-adjusted goal',
    Icon: Crosshair,
  },
  {
    slug: 'sip-delay',
    category: 'financial',
    title: 'SIP Delay Cost',
    subtitle: 'See the compounding cost of postponing your SIP start',
    Icon: ClockCountdown,
  },
  {
    slug: 'swp',
    category: 'financial',
    title: 'SWP Calculator',
    subtitle: 'Systematic withdrawal plan longevity & ending corpus',
    Icon: ArrowsDownUp,
  },
  {
    slug: 'emi',
    category: 'financial',
    title: 'EMI Calculator',
    subtitle: 'Loan EMI, interest burden & mid-tenure balance check',
    Icon: HouseLine,
  },
  // Quick Tools (3)
  {
    slug: 'single-amount',
    category: 'quick-tools',
    title: 'Single Amount',
    subtitle: 'Present Value & Future Value of a lump sum',
    Icon: CurrencyInr,
  },
  {
    slug: 'irregular-cash-flow',
    category: 'quick-tools',
    title: 'Irregular Cash Flow',
    subtitle: 'PV / FV across uneven future receivables or outflows',
    Icon: ListNumbers,
  },
  {
    slug: 'weighted-avg',
    category: 'quick-tools',
    title: 'Weighted Avg. Returns',
    subtitle: 'Blended CAGR & future value across multiple assets',
    Icon: ChartPieSlice,
  },
];

export function CalculatorsHub() {
  const searchParams = useSearchParams();
  const urlCalc = searchParams.get('calc') as CalculatorSlug | null;

  const initialItem =
    CALCULATORS.find((item) => item.slug === urlCalc) ?? CALCULATORS[0];

  const [activeCategory, setActiveCategory] = React.useState<CategoryKey>(
    initialItem.category,
  );
  const [activeSlug, setActiveSlug] = React.useState<CalculatorSlug>(
    initialItem.slug,
  );

  React.useEffect(() => {
    if (!urlCalc) return;
    const match = CALCULATORS.find((item) => item.slug === urlCalc);
    if (match) {
      setActiveCategory(match.category);
      setActiveSlug(match.slug);
    }
  }, [urlCalc]);

  const syncUrl = (slug: CalculatorSlug) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('calc', slug);
    window.history.replaceState(null, '', url.toString());
  };

  const handleSelectCategory = (category: CategoryKey) => {
    setActiveCategory(category);
    const firstInCategory = CALCULATORS.find((c) => c.category === category);
    if (firstInCategory) {
      setActiveSlug(firstInCategory.slug);
      syncUrl(firstInCategory.slug);
    }
  };

  const handleSelectCalculator = (item: CalculatorItem) => {
    setActiveCategory(item.category);
    setActiveSlug(item.slug);
    syncUrl(item.slug);
  };

  const categoryItems = CALCULATORS.filter(
    (item) => item.category === activeCategory,
  );
  const activeMeta =
    CALCULATORS.find((item) => item.slug === activeSlug) ?? CALCULATORS[0];
  const activeCategoryMeta =
    CATEGORIES.find((c) => c.key === activeCategory) ?? CATEGORIES[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Category Switcher */}
      <div
        role="tablist"
        aria-label="Calculator Categories"
        className="grid grid-cols-1 gap-3 md:grid-cols-3"
      >
        {CATEGORIES.map((cat) => {
          const selected = cat.key === activeCategory;
          return (
            <button
              key={cat.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => handleSelectCategory(cat.key)}
              className={cn(
                'flex min-h-[72px] cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]',
                selected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[var(--shadow-md)]'
                  : 'border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] hover:border-[#CBD5E1] hover:bg-[var(--color-primary-soft)]/50',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-bold">{cat.label}</span>
                <span
                  className={cn(
                    'numeric-tabular rounded-full px-2.5 py-0.5 text-xs font-bold',
                    selected
                      ? 'bg-white/20 text-white'
                      : 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
                  )}
                >
                  {cat.count}
                </span>
              </div>
              <p
                className={cn(
                  'mt-1 text-xs leading-relaxed',
                  selected
                    ? 'text-[var(--color-on-brand-muted)]'
                    : 'text-[var(--color-muted-foreground)]',
                )}
              >
                {cat.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Sub-calculator Selector Strip */}
      <div
        role="tablist"
        aria-label={`${activeCategoryMeta.label} Tools`}
        className={cn(
          'grid grid-cols-1 gap-2.5 sm:grid-cols-2',
          categoryItems.length === 4 && 'lg:grid-cols-4',
          categoryItems.length === 5 && 'lg:grid-cols-5',
          categoryItems.length === 3 && 'lg:grid-cols-3',
        )}
      >
        {categoryItems.map((item) => {
          const selected = item.slug === activeSlug;
          const Icon = item.Icon;
          return (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => handleSelectCalculator(item)}
              className={cn(
                'flex min-h-[64px] cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]',
                selected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] shadow-[var(--shadow-sm)]'
                  : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[#CBD5E1] hover:bg-[var(--color-muted)]/60',
              )}
            >
              <span
                className={cn(
                  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                  selected
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-muted)] text-[var(--color-primary)]',
                )}
              >
                <Icon size={20} weight="regular" aria-hidden={true} />
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    'block text-sm font-bold',
                    selected
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-secondary)]',
                  )}
                >
                  {item.title}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-[var(--color-muted-foreground)]">
                  {item.subtitle}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Calculator Workspace */}
      <Card
        role="tabpanel"
        aria-label={activeMeta.title}
        className="p-5 sm:p-8 shadow-[var(--shadow-md)]"
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <activeMeta.Icon size={24} weight="regular" aria-hidden={true} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-growth-text)]">
                {activeCategoryMeta.label}
              </p>
              <h2 className="text-xl font-bold text-[var(--color-secondary)] sm:text-2xl">
                {activeMeta.title}
              </h2>
            </div>
          </div>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            {activeMeta.subtitle}
          </p>
        </div>

        {activeCategory === 'life-goals' && (
          <LifeGoalCalculators activeSlug={activeSlug as LifeGoalSlug} />
        )}
        {activeCategory === 'financial' && (
          <FinancialCalculators activeSlug={activeSlug as FinancialSlug} />
        )}
        {activeCategory === 'quick-tools' && (
          <QuickToolsCalculators activeSlug={activeSlug as QuickToolSlug} />
        )}
      </Card>
    </div>
  );
}
