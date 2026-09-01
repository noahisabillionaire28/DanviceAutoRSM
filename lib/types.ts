import type {
  BodyType, Drivetrain, FuelType, Transmission, VehicleRow,
} from './supabase/database.types';

export type Vehicle = VehicleRow;

/** The subset a card needs — keeps grid queries narrow. */
export type VehicleCardData = Pick<
  VehicleRow,
  | 'id' | 'slug' | 'year' | 'make' | 'model' | 'trim_level'
  | 'price' | 'previous_price' | 'mileage' | 'body_type'
  | 'transmission' | 'drivetrain' | 'fuel_type' | 'images'
  | 'exterior_color' | 'mpg_city' | 'mpg_highway'
>;

export const CARD_COLUMNS =
  'id, slug, year, make, model, trim_level, price, previous_price, mileage, body_type, transmission, drivetrain, fuel_type, images, exterior_color, mpg_city, mpg_highway';

export interface FacetValue<T extends string = string> {
  value: T;
  count: number;
}

export interface InventoryFacets {
  makes: FacetValue[];
  bodyTypes: FacetValue<BodyType>[];
  priceMin: number;
  priceMax: number;
  yearMin: number;
  yearMax: number;
  mileageMax: number;
  total: number;
}

export type SortKey =
  | 'newest' | 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc';

export interface VehicleFilters {
  make: string[];
  body: BodyType[];
  transmission: Transmission[];
  drivetrain: Drivetrain[];
  fuel: FuelType[];
  minPrice?: number;
  maxPrice?: number;
  maxMileage?: number;
  minYear?: number;
  q?: string;
  sort: SortKey;
  page: number;
}

export interface PaymentEstimate {
  monthly: number;
  amountFinanced: number;
  totalInterest: number;
  termMonths: number;
  apr: number;
  downPayment: number;
}

export type LeadFormState =
  | { status: 'idle' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string[]> }
  | { status: 'success'; firstName: string };
