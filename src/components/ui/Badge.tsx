import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-normal leading-snug',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
        growth: 'bg-[var(--color-growth-soft)] text-[var(--color-growth-pill-text)]',
        gold: 'bg-[var(--color-gold-soft)] text-[var(--color-gold-pill-text)]',
        goldSolid: 'bg-[var(--color-gold-brand)] text-[var(--color-secondary)]',
        muted: 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}
