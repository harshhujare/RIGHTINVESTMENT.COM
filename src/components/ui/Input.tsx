import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex min-h-[44px] w-full rounded-lg border-[1.5px] border-[var(--color-border-input)] bg-[var(--color-card)] px-3.5 py-2.5 text-base text-[var(--color-foreground)] placeholder:text-[#64748B] transition-colors duration-200 focus-visible:border-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[var(--color-destructive)]',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
