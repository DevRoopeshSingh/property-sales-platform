import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(["RESIDENTIAL", "COMMERCIAL"]),
  subType: z.enum([
    "APARTMENT",
    "VILLA",
    "INDEPENDENT_HOUSE",
    "ROW_HOUSE",
    "PLOT",
    "SHOP",
    "OFFICE",
    "SHOWROOM",
  ]),
  status: z.enum(["DRAFT", "ACTIVE", "SOLD", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  isDistressed: z.boolean().default(false),
  duesPending: z.string().nullable().optional(),

  // Pricing
  price: z.coerce.number().min(0, "Price must be a positive number"),
  priceLabel: z.string().min(1, "Price label is required (e.g., 'Cr', 'Lakhs')"),
  priceNegotiable: z.boolean().default(false),

  // Specs
  bhk: z.coerce.number().nullable().optional(),
  area: z.coerce.number().nullable().optional(),
  carpetArea: z.coerce.number().nullable().optional(),
  floor: z.coerce.number().nullable().optional(),
  totalFloors: z.coerce.number().nullable().optional(),

  // Location
  locality: z.enum([
    "SEAWOODS",
    "KHARGHAR",
    "TALOJA",
    "NERUL",
    "VASHI",
    "CBD_BELAPUR",
    "AIROLI",
    "GHANSOLI",
    "ULWE",
    "KAMOTHE",
    "SANPADA",
    "KALAMBOLI",
    "PANVEL",
  ]),
  address: z.string().min(5, "Address must be at least 5 characters"),
  landmark: z.string().nullable().optional(),
  latitude: z.coerce.number().nullable().optional(),
  longitude: z.coerce.number().nullable().optional(),
  googleMapsUrl: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),

  // Details
  possession: z.enum(["READY_TO_MOVE", "UNDER_CONSTRUCTION", "NEW_LAUNCH"]),
  possessionDate: z.string().nullable().optional(),
  reraNumber: z.string().nullable().optional(),
  projectName: z.string().nullable().optional(),
  builderName: z.string().nullable().optional(),

  // Amenities
  amenities: z.array(z.string()).default([]),

  // SEO
  metaTitle: z.string().max(60).nullable().optional(),
  metaDescription: z.string().max(160).nullable().optional(),

  // Images (URLs from Supabase Storage)
  images: z
    .array(
      z.object({
        url: z.string().url(),
        key: z.string(),
        altText: z.string().optional().nullable(),
        isPrimary: z.boolean().default(false),
      })
    )
    .default([]),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
