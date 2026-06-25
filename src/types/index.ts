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
  | "MUMBAI"
  | "NAVI_MUMBAI"
  | "THANE"
  | "MIRA_ROAD"
  | "BHAYANDAR"
  | "NAIGAON"
  | "VASAI"
  | "NALASOPARA"
  | "VIRAR"
  | "DELHI"
  | "BANGALORE"
  | "PUNE"
  | "HYDERABAD"
  | "CHENNAI";

// ─────────────────────────────────────────
// Display label maps
// ─────────────────────────────────────────

export const LOCALITY_LABELS: Record<Locality, string> = {
  MUMBAI: "Mumbai",
  NAVI_MUMBAI: "Navi Mumbai",
  THANE: "Thane",
  MIRA_ROAD: "Mira Road",
  BHAYANDAR: "Bhayandar",
  NAIGAON: "Naigaon",
  VASAI: "Vasai",
  NALASOPARA: "Nalasopara",
  VIRAR: "Virar",
  DELHI: "Delhi",
  BANGALORE: "Bangalore",
  PUNE: "Pune",
  HYDERABAD: "Hyderabad",
  CHENNAI: "Chennai",
};

export const LOCALITY_SLUGS: Record<Locality, string> = {
  MUMBAI: "mumbai",
  NAVI_MUMBAI: "navi-mumbai",
  THANE: "thane",
  MIRA_ROAD: "mira-road",
  BHAYANDAR: "bhayandar",
  NAIGAON: "naigaon",
  VASAI: "vasai",
  NALASOPARA: "nalasopara",
  VIRAR: "virar",
  DELHI: "delhi",
  BANGALORE: "bangalore",
  PUNE: "pune",
  HYDERABAD: "hyderabad",
  CHENNAI: "chennai",
};

export const SLUG_TO_LOCALITY: Record<string, Locality> = {
  mumbai: "MUMBAI",
  "navi-mumbai": "NAVI_MUMBAI",
  thane: "THANE",
  "mira-road": "MIRA_ROAD",
  bhayandar: "BHAYANDAR",
  naigaon: "NAIGAON",
  vasai: "VASAI",
  nalasopara: "NALASOPARA",
  virar: "VIRAR",
  delhi: "DELHI",
  bangalore: "BANGALORE",
  pune: "PUNE",
  hyderabad: "HYDERABAD",
  chennai: "CHENNAI",
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
