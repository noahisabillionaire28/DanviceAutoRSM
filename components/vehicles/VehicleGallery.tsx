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
        aspect="3/2"
        priority
        sizes="(min-width:1024px) 60vw, 100vw"
        quality={85}
        placeholderLabel={placeholderLabel}
        className="rounded-xl"
        imageClassName="p-5 md:p-8"
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
                i === active ? 'ring-blue-900' : 'ring-transparent hover:ring-blue-200',
              )}
            >
              <VehicleImage
                src={src}
                alt=""
                aspect="3/2"
                sizes="18vw"
                quality={50}
                imageClassName="p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
