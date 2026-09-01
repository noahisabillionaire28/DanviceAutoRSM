// Generated from the live schema via Supabase `generate_typescript_types`,
// trimmed to what this app actually uses. Regenerate after any migration.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BodyType =
  | 'sedan' | 'suv' | 'truck' | 'coupe'
  | 'hatchback' | 'minivan' | 'wagon' | 'convertible';
export type Drivetrain = 'fwd' | 'rwd' | 'awd' | '4wd';
export type FuelType =
  | 'gasoline' | 'hybrid' | 'plug_in_hybrid'
  | 'electric' | 'diesel' | 'flex_fuel';
export type Transmission = 'automatic' | 'manual' | 'cvt' | 'dual_clutch';
export type VehicleStatus = 'available' | 'pending' | 'sold' | 'hidden';
export type LeadType = 'general' | 'financing' | 'sell_your_car' | 'vehicle_inquiry';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed' | 'spam';

export interface VehicleRow {
  id: string;
  slug: string;
  stock_number: string;
  vin: string | null;
  year: number;
  make: string;
  model: string;
  trim_level: string | null;
  price: number;
  previous_price: number | null;
  mileage: number;
  body_type: BodyType;
  transmission: Transmission;
  drivetrain: Drivetrain;
  fuel_type: FuelType;
  exterior_color: string | null;
  interior_color: string | null;
  doors: number | null;
  seats: number | null;
  engine: string | null;
  cylinders: number | null;
  mpg_city: number | null;
  mpg_highway: number | null;
  images: string[];
  image_credits: Json;
  description: string | null;
  features: string[];
  status: VehicleStatus;
  is_featured: boolean;
  date_listed: string;
  created_at: string;
  updated_at: string;
}

/** Columns anon is granted INSERT on. Anything else is rejected at the GRANT layer. */
export interface LeadInsert {
  name: string;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  lead_type?: LeadType;
  vehicle_id?: string | null;
  source_page?: string;
  consent?: boolean;
  details?: Json;
  user_agent?: string | null;
  referrer?: string | null;
}

export interface LeadRow extends Required<Omit<LeadInsert, 'details'>> {
  id: string;
  created_at: string;
  details: Json;
  status: LeadStatus;
  internal_note: string | null;
  ip_hash: string | null;
}

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: VehicleRow;
        Insert: Partial<VehicleRow> & Pick<VehicleRow, 'slug' | 'stock_number' | 'year' | 'make' | 'model' | 'price' | 'mileage' | 'body_type' | 'transmission' | 'drivetrain'>;
        Update: Partial<VehicleRow>;
        Relationships: [];
      };
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: Partial<LeadRow>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      inventory_facets: { Args: Record<string, never>; Returns: Json };
    };
    Enums: {
      body_type: BodyType;
      drivetrain: Drivetrain;
      fuel_type: FuelType;
      lead_status: LeadStatus;
      lead_type: LeadType;
      transmission: Transmission;
      vehicle_status: VehicleStatus;
    };
    CompositeTypes: Record<never, never>;
  };
}
