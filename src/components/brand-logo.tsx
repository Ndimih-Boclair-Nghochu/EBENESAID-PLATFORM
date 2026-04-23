import Image from 'next/image';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  showWordmark?: boolean;
  wordmarkClassName?: string;
};

export function BrandLogo({
  className,
  imageClassName,
  priority = false,
  showWordmark = false,
  wordmarkClassName,
}: BrandLogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Image
        src="/brand/ebenesaid-logo.jpeg"
        alt="EBENESAID logo"
        width={256}
        height={256}
        priority={priority}
        className={cn('h-auto w-14 object-contain', imageClassName)}
      />
      {showWordmark ? (
        <span className={cn('text-lg font-black uppercase italic tracking-tighter', wordmarkClassName)}>
          EBENESAID
        </span>
      ) : null}
    </div>
  );
}
