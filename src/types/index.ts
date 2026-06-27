// Shared TypeScript types for the Property Sales Platform

export type PropertyType = "RESIDENTIAL" | "COMMERCIAL";

export type PropertySubType =
  | "APARTMENT"
  | "VILLA"
  | "INDEPENDENT_HOUSE"
  | "ROW_HOUSE"
  | "PLOT"
  | "SHOP"
  | "OFFICE"
  | "SHOWROOM";

export type PropertyStatus = "DRAFT" | "ACTIVE" | "SOLD" | "ARCHIVED";

export type Possession =
  | "READY_TO_MOVE"
  | "UNDER_CONSTRUCTION"
  | "NEW_LAUNCH";

export type LeadSource = "WHATSAPP" | "CALL" | "FORM";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "SITE_VISIT_SCHEDULED"
  | "CONVERTED"
  | "LOST";

export type Locality =
  | "SEAWOODS"
  | "KHARGHAR"
  | "TALOJA"
  | "NERUL"
  | "VASHI"
  | "CBD_BELAPUR"
  | "AIROLI"
  | "GHANSOLI"
  | "ULWE"
  | "KAMOTHE"
  | "SANPADA"
  | "KALAMBOLI"
  | "PANVEL";

// ─────────────────────────────────────────
// Display label maps
// ─────────────────────────────────────────

export const LOCALITY_LABELS: Record<Locality, string> = {
  SEAWOODS: "Seawoods",
  KHARGHAR: "Kharghar",
  TALOJA: "Taloja",
  NERUL: "Nerul",
  VASHI: "Vashi",
  CBD_BELAPUR: "CBD Belapur",
  AIROLI: "Airoli",
  GHANSOLI: "Ghansoli",
  ULWE: "Ulwe",
  KAMOTHE: "Kamothe",
  SANPADA: "Sanpada",
  KALAMBOLI: "Kalamboli",
  PANVEL: "Panvel",
};

export const LOCALITY_SLUGS: Record<Locality, string> = {
  SEAWOODS: "seawoods",
  KHARGHAR: "kharghar",
  TALOJA: "taloja",
  NERUL: "nerul",
  VASHI: "vashi",
  CBD_BELAPUR: "cbd-belapur",
  AIROLI: "airoli",
  GHANSOLI: "ghansoli",
  ULWE: "ulwe",
  KAMOTHE: "kamothe",
  SANPADA: "sanpada",
  KALAMBOLI: "kalamboli",
  PANVEL: "panvel",
};

export const SLUG_TO_LOCALITY: Record<string, Locality> = {
  seawoods: "SEAWOODS",
  kharghar: "KHARGHAR",
  taloja: "TALOJA",
  nerul: "NERUL",
  vashi: "VASHI",
  "cbd-belapur": "CBD_BELAPUR",
  airoli: "AIROLI",
  ghansoli: "GHANSOLI",
  ulwe: "ULWE",
  kamothe: "KAMOTHE",
  sanpada: "SANPADA",
  kalamboli: "KALAMBOLI",
  panvel: "PANVEL",
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
};

export const PROPERTY_SUB_TYPE_LABELS: Record<PropertySubType, string> = {
  APARTMENT: "Apartment",
  VILLA: "Villa",
  INDEPENDENT_HOUSE: "Independent House",
  ROW_HOUSE: "Row House",
  PLOT: "Plot",
  SHOP: "Shop",
  OFFICE: "Office",
  SHOWROOM: "Showroom",
};

export const POSSESSION_LABELS: Record<Possession, string> = {
  READY_TO_MOVE: "Ready to Move",
  UNDER_CONSTRUCTION: "Under Construction",
  NEW_LAUNCH: "New Launch",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  SITE_VISIT_SCHEDULED: "Site Visit Scheduled",
  CONVERTED: "Converted",
  LOST: "Lost",
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  WHATSAPP: "WhatsApp",
  CALL: "Call",
  FORM: "Form",
};

// ─────────────────────────────────────────
// Property interface (for client components)
// ─────────────────────────────────────────

export interface PropertyImage {
  id: string;
  url: string;
  altText: string | null;
  order: number;
  isPrimary: boolean;
}

export interface PropertyCardData {
  id: string;
  title: string;
  slug: string;
  type: PropertyType;
  subType: PropertySubType;
  status: PropertyStatus;
  featured: boolean;
  isDistressed: boolean;
  price: number;
  priceLabel: string;
  bhk: number | null;
  area: number | null;
  floor: number | null;
  locality: Locality;
  address: string;
  possession: Possession;
  images: PropertyImage[];
  createdAt: Date;
  projectName?: string | null;
  builderName?: string | null;
  reraNumber?: string | null;
  totalFloors?: number | null;
}

export interface PropertyDetail extends PropertyCardData {
  description: string;
  carpetArea: number | null;
  totalFloors: number | null;
  landmark: string | null;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string | null;
  possessionDate: string | null;
  reraNumber: string | null;
  projectName: string | null;
  builderName: string | null;
  duesPending: string | null;
  amenities: string[];
  metaTitle: string | null;
  metaDescription: string | null;
}

// ─────────────────────────────────────────
// Lead interface
// ─────────────────────────────────────────

export interface LeadData {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  source: LeadSource;
  status: LeadStatus;
  propertyId: string | null;
  propertyTitle: string | null;
  adminNotes: string | null;
  followUpDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────
// Filter types
// ─────────────────────────────────────────

export interface PropertyFilters {
  localities?: Locality[];
  type?: PropertyType;
  subTypes?: PropertySubType[];
  bhk?: number[];
  minPrice?: number;
  maxPrice?: number;
  possession?: Possession[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "newest" | "price_asc" | "price_desc" | "featured";
}

// ─────────────────────────────────────────
// Amenities list
// ─────────────────────────────────────────

export const AMENITIES_LIST = [
  "Covered Parking",
  "Open Parking",
  "24/7 Security",
  "CCTV Surveillance",
  "Gym / Fitness Center",
  "Swimming Pool",
  "Clubhouse",
  "Children's Play Area",
  "Garden / Landscaping",
  "Lift / Elevator",
  "Power Backup",
  "Water Supply 24/7",
  "Intercom",
  "Fire Safety",
  "Visitor Parking",
  "Jogging Track",
  "Indoor Games Room",
  "Community Hall",
  "Senior Citizen Area",
  "Vastu Compliant",
  "Rain Water Harvesting",
  "Solar Panels",
  "EV Charging",
  "Pet Friendly",
];
