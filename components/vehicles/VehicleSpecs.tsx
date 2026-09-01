import { formatMileage, formatNumber, label } from '@/lib/format';
import type { Vehicle } from '@/lib/types';

export function VehicleSpecs({ vehicle: v }: { vehicle: Vehicle }) {
  const rows: [string, string | null][] = [
    ['Mileage', formatMileage(v.mileage)],
    ['Body style', label(v.body_type)],
    ['Transmission', label(v.transmission)],
    ['Drivetrain', label(v.drivetrain)],
    ['Fuel', label(v.fuel_type)],
    ['Engine', v.engine],
    ['Exterior', v.exterior_color],
    ['Interior', v.interior_color],
    [
      'Fuel economy',
      v.mpg_city && v.mpg_highway ? `${v.mpg_city} city / ${v.mpg_highway} hwy MPG` : null,
    ],
    ['Seats', v.seats ? formatNumber(v.seats) : null],
    ['Stock number', v.stock_number],
    ['VIN', v.vin],
  ];

  return (
    <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
      {rows
        .filter((r): r is [string, string] => Boolean(r[1]))
        .map(([k, val]) => (
          <div
            key={k}
            className="flex items-baseline justify-between gap-4 border-b border-navy-100 py-3"
          >
            <dt className="text-sm text-muted">{k}</dt>
            <dd className="tnum text-right text-sm text-navy-900">{val}</dd>
          </div>
        ))}
    </dl>
  );
}
