'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { BLUR_DATA_URL, DEFAULT_CARD_SIZES, resolveVehicleImage } from '@/lib/images';
import { VehiclePlaceholder } from './VehiclePlaceholder';

/**
 * 3/2 is the house ratio: it is what most vehicle photography is actually shot
 * at, so a contained photo leaves the least empty space. Every skeleton that
 * stands in for an image must use the same ratio or the swap causes CLS.
 */
const ASPECTS = {
  '3/2': 'aspect-[3/2]',
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
  aspect = '3/2',
  sizes = DEFAULT_CARD_SIZES,
  priority = false,
  quality = 78,
  className,
  imageClassName,
  placeholderLabel,
}: VehicleImageProps) {
  const [failed, setFailed] = useState(false);

  const ref = src ?? images?.[index] ?? null;
  const resolved = resolveVehicleImage(ref);

  // Short-circuit BEFORE constructing <Image>. next/image throws a hard runtime
  // error for a host missing from remotePatterns, and onError fires too late to
  // catch it. See lib/images.ts.
  const showPlaceholder = resolved.kind === 'invalid' || failed;

  return (
    <div
      className={cn(
        // Warm off-white panel, slightly tinted from the white card body, so a
        // contained photo reads as a framed product shot rather than as a
        // letterboxed video.
        'relative overflow-hidden bg-neutral-100',
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
          className={cn(
            // No JS opacity gate here, deliberately. This used to render at
            // opacity-0 until an onLoad handler flipped state — but if the
            // image finishes loading BEFORE React attaches that handler,
            // onLoad never fires and the image stays invisible forever. The
            // detail-page hero passes `priority`, so Next preloads it and it
            // is reliably complete before hydration: the highest-intent photo
            // on the site rendered as an empty box. next/image's blur
            // placeholder already provides the fade, so the gate bought
            // nothing and cost the hero image.
            //
            // object-contain, never object-cover: cover crops to fill the box,
            // which cut the front or rear off cars whose native ratio differs
            // from the frame. Padding keeps the car off the panel edges.
            'object-contain p-3',
            imageClassName,
          )}
        />
      )}
    </div>
  );
}
