import Link from 'next/link';
import { cn } from '@/lib/cn';
import { formatMileage, formatPrice, label, vehicleTitle } from '@/lib/format';
import { quickMonthly } from '@/lib/payment';
import type { VehicleCardData } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { VehicleImage } from './VehicleImage';

export function VehicleCard({
  vehicle,
  priority = false,
  className,
}: {
  vehicle: VehicleCardData;
  priority?: boolean;
  className?: string;
}) {
  const title = vehicleTitle(vehicle);
  const hasDrop = vehicle.previous_price != null && vehicle.previous_price > vehicle.price;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg bg-surface shadow-card ring-1 ring-blue-100/70 transition-all duration-300 ease-brand hover:-translate-y-0.5 hover:shadow-card-hover',
        className,
      )}
    >
      <div className="relative">
        <VehicleImage
          images={vehicle.images}
          alt={`${title} ${vehicle.trim_level ?? ''}`.trim()}
          aspect="3/2"
          priority={priority}
          placeholderLabel={title}
        />
        {hasDrop && (
          <div className="absolute left-3 top-3">
            <Badge tone="navy">Price reduced</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg leading-snug text-blue-900">
          <Link href={`/inventory/${vehicle.slug}`} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
        {vehicle.trim_level && (
          <p className="mt-0.5 text-sm text-muted">{vehicle.trim_level}</p>
        )}

        <dl className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <div>
            <dt className="sr-only">Mileage</dt>
            <dd className="tnum">{formatMileage(vehicle.mileage)}</dd>
          </div>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-blue-200" />
          <div>
            <dt className="sr-only">Transmission</dt>
            <dd>{label(vehicle.transmission)}</dd>
          </div>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-blue-200" />
          <div>
            <dt className="sr-only">Drivetrain</dt>
            <dd>{label(vehicle.drivetrain)}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            {hasDrop && (
              <p className="tnum text-sm text-muted line-through">
                {formatPrice(vehicle.previous_price!)}
              </p>
            )}
            <p className="tnum font-display text-2xl text-blue-900">
              {formatPrice(vehicle.price)}
            </p>
          </div>
          <p className="tnum pb-1 text-right text-sm text-muted">
            ${quickMonthly(vehicle.price)}
            <span className="text-xs">/mo est.</span>
          </p>
        </div>
      </div>
    </article>
  );
}
