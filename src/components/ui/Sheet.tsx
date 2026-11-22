'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export function SheetContent({
  className,
  title,
  closeLabel,
  children,
}: {
  className?: string;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#0A1628]/50 backdrop-blur-[2px]" />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-[88vw] max-w-sm flex-col bg-[var(--color-card)] p-6 shadow-[var(--shadow-xl)] focus-visible:outline-none',
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <DialogPrimitive.Title className="text-lg font-semibold text-[var(--color-primary)]">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Close
            aria-label={closeLabel}
            className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)]"
          >
            <X size={20} weight="regular" aria-hidden="true" />
          </DialogPrimitive.Close>
        </div>
        <div
          data-lenis-prevent
          className="mt-5 flex flex-1 flex-col overflow-y-auto"
        >
          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
