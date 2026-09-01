'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { usableImages } from '@/lib/images';
import { VehicleImage } from './VehicleImage';

export function VehicleGallery({
  images,
  alt,
  placeholderLabel,
}: {
  images: string[];
  alt: string;
  placeholderLabel?: string;
}) {
  const usable = usableImages(images);
  const [active, setActive] = useState(0);

  return (
    <div>
      <VehicleImage
        src={usable[active] ?? null}
        alt={usable.length ? `${alt} — photo ${active + 1} of ${usable.length}` : alt}
        aspect="4/3"
        priority
        sizes="(min-width:1024px) 60vw, 100vw"
        quality={85}
        placeholderLabel={placeholderLabel}
        className="rounded-xl"
      />

      {usable.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {usable.slice(0, 5).map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === active}
              className={cn(
                'overflow-hidden rounded-md ring-2 transition-all duration-200',
                i === active ? 'ring-navy-900' : 'ring-transparent hover:ring-navy-200',
              )}
            >
              <VehicleImage
                src={src}
                alt=""
                aspect="4/3"
                sizes="18vw"
                quality={50}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
