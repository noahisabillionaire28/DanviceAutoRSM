'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { BLUR_DATA_URL, DEFAULT_CARD_SIZES, resolveVehicleImage } from '@/lib/images';
import { VehiclePlaceholder } from './VehiclePlaceholder';

const ASPECTS = {
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-[16/9]',
  '1/1': 'aspect-square',
  auto: '',
} as const;

export interface VehicleImageProps {
  src?: string | null;
  images?: string[] | null;
  index?: number;
  alt: string;
  aspect?: keyof typeof ASPECTS;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  className?: string;
  imageClassName?: string;
  placeholderLabel?: string;
}

export function VehicleImage({
  src,
  images,
  index = 0,
  alt,
  aspect = '4/3',
  sizes = DEFAULT_CARD_SIZES,
  priority = false,
  quality = 78,
  className,
  imageClassName,
  placeholderLabel,
}: VehicleImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const ref = src ?? images?.[index] ?? null;
  const resolved = resolveVehicleImage(ref);

  // Short-circuit BEFORE constructing <Image>. next/image throws a hard runtime
  // error for a host missing from remotePatterns, and onError fires too late to
  // catch it. See lib/images.ts.
  const showPlaceholder = resolved.kind === 'invalid' || failed;

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-navy-900',
        ASPECTS[aspect],
        className,
      )}
    >
      {showPlaceholder ? (
        <VehiclePlaceholder label={placeholderLabel} />
      ) : (
        <Image
          src={resolved.url}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          onError={() => setFailed(true)}
          onLoad={() => setLoaded(true)}
          className={cn(
            'object-cover transition-opacity duration-500 ease-brand',
            loaded ? 'opacity-100' : 'opacity-0',
            imageClassName,
          )}
        />
      )}
    </div>
  );
}
