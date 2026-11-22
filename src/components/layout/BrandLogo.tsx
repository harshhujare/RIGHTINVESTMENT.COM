import Image from 'next/image';
import { cn } from '@/lib/utils';

export function BrandLogo({
  brandName,
  adviserName,
  variant = 'light',
  size = 'header',
  priority = false,
  className,
}: {
  brandName: string;
  adviserName: string;
  variant?: 'light' | 'dark';
  size?: 'header' | 'footer';
  priority?: boolean;
  className?: string;
}) {
  const sealDimensions =
    size === 'footer'
      ? 'h-14 w-14'
      : 'h-11 w-11 sm:h-[52px] sm:w-[52px]';

  const imgPixels = size === 'footer' ? 56 : 52;

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full aspect-square',
          sealDimensions,
        )}
      >
        <Image
          src="/logo.png"
          alt="Right Investment circular emblem"
          width={imgPixels}
          height={imgPixels}
          priority={priority}
          className="h-full w-full object-contain"
        />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span
          className={cn(
            'text-[17px] font-bold tracking-tight sm:text-lg',
            variant === 'dark'
              ? 'text-white'
              : 'text-[var(--color-primary)]',
          )}
        >
          {brandName}
        </span>
        <span
          className={cn(
            'text-xs font-medium sm:text-[13px]',
            variant === 'dark'
              ? 'text-[var(--color-on-brand-muted)]'
              : 'text-[var(--color-muted-foreground)]',
          )}
        >
          {adviserName}
        </span>
      </span>
    </span>
  );
}
