import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { WarningCircle } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/lib/utils';

export function Field({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5', className)} {...props} />;
}

export const FieldLabel = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-[15px] font-medium text-[var(--color-foreground)] leading-snug',
      className,
    )}
    {...props}
  />
));
FieldLabel.displayName = 'FieldLabel';

export function FieldHint({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-[var(--color-muted-foreground)]', className)}
      {...props}
    />
  );
}

export function FieldError({
  id,
  message,
  className,
}: {
  id?: string;
  message?: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn(
        'mt-0.5 flex items-start gap-1.5 text-sm font-medium text-[var(--color-destructive)]',
        className,
      )}
    >
      <WarningCircle size={16} weight="fill" className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}
