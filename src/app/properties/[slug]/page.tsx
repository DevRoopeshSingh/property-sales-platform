import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  MapPin, BedDouble, Maximize2, Building2, CalendarCheck,
  ShieldCheck, Phone, CheckCircle2, ChevronRight
} from "lucide-react";
import StickyContactBar from "@/components/public/StickyContactBar";
import PropertyCard from "@/components/public/PropertyCard";
import { generateWhatsAppLink, generateCallLink } from "@/lib/whatsapp";
import {
  LOCALITY_LABELS,
  PROPERTY_SUB_TYPE_LABELS,
  POSSESSION_LABELS,
  type Locality,
  type PropertySubType,
  type Possession,
} from "@/types";

// Demo property detail data (will be replaced with DB lookup via Server Actions)
const DEMO_PROPERTY = {
  id: "demo-property-1",
  title: "Spacious 2BHK Apartment in Virar West — Sunrise Heights",
  slug: "property-1",
  type: "RESIDENTIAL" as const,
  subType: "APARTMENT" as PropertySubType,
  status: "ACTIVE" as const,
  featured: true,
  price: 4500000,
  priceLabel: "₹45 Lakhs",
  priceNegotiable: true,
  bhk: 2,
  area: 850,
  carpetArea: 720,
  floor: 5,
  totalFloors: 14,
  locality: "VIRAR" as Locality,
  address: "Sunrise Heights, Virar West, Mumbai - 401303",
  landmark: "Near Virar Railway Station",
  googleMapsUrl: "https://maps.google.com",
  possession: "READY_TO_MOVE" as Possession,
  possessionDate: null,
  reraNumber: "P51700012345",
  projectName: "Sunrise Heights",
  builderName: "Sunrise Developers",
  description: `Welcome to Sunrise Heights — a thoughtfully designed residential community in the heart of Virar West. This well-appointed 2BHK apartment offers the perfect blend of comfort, convenience, and connectivity.

The apartment features a spacious living room with large windows that fill the space with natural light, a modern modular kitchen, two comfortable bedrooms with ample storage, and two well-designed bathrooms. The project is strategically located just 5 minutes from Virar Railway Station, ensuring seamless connectivity to Mumbai.

Sunrise Heights is a RERA-registered project with all approvals in place. The complex offers world-class amenities including a clubhouse, swimming pool, gym, children's play area, and 24/7 security — everything you need for a complete living experience.

Don't miss this opportunity to own your dream home in one of Virar's most sought-after residential projects.`,
  amenities: [
    "Covered Parking", "24/7 Security", "CCTV Surveillance", "Gym / Fitness Center",
    "Swimming Pool", "Clubhouse", "Children's Play Area", "Garden / Landscaping",
    "Lift / Elevator", "Power Backup", "Water Supply 24/7", "Intercom",
    "Fire Safety", "Visitor Parking", "Jogging Track",
  ],
  images: [
    { id: "1", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", altText: "Living Room", order: 0, isPrimary: true },
    { id: "2", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", altText: "Bedroom", order: 1, isPrimary: false },
    { id: "3", url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800", altText: "Kitchen", order: 2, isPrimary: false },
    { id: "4", url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800", altText: "Bathroom", order: 3, isPrimary: false },
  ],
  metaTitle: "2BHK Apartment in Virar West | ₹45 Lakhs | PropConnect",
  metaDescription: "Spacious 2BHK apartment in Virar West at ₹45 Lakhs. Ready to Move, RERA registered. Swimming Pool, Gym & Clubhouse. Contact us on WhatsApp.",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const SIMILAR_PROPERTIES = Array.from({ length: 3 }, (_, i) => ({
  id: `similar-${i}`,
  title: ["2BHK in Nalasopara East", "1BHK in Virar East", "3BHK in Vasai West"][i],
  slug: `similar-${i + 1}`,
  type: "RESIDENTIAL" as const,
  subType: "APARTMENT" as PropertySubType,
  status: "ACTIVE" as const,
  featured: false,
  price: [3800000, 2200000, 6500000][i],
  priceLabel: ["₹38 L", "₹22 L", "₹65 L"][i],
  bhk: [2, 1, 3][i],
  area: [700, 450, 1100][i],
  floor: [3, 6, 9][i],
  locality: (["NALASOPARA", "VIRAR", "VASAI"] as Locality[])[i],
  address: "Sample Address",
  possession: "READY_TO_MOVE" as Possession,
  images: [],
  createdAt: new Date(),
}));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // In production: fetch from DB by slug
  if (slug !== DEMO_PROPERTY.slug) {
    return { title: "Property Not Found" };
  }
  return {
    title: DEMO_PROPERTY.metaTitle ?? DEMO_PROPERTY.title,
    description: DEMO_PROPERTY.metaDescription ?? DEMO_PROPERTY.description.slice(0, 160),
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // In production: const property = await getProperty(slug);
  const property = slug === DEMO_PROPERTY.slug ? DEMO_PROPERTY : null;
  if (!property) notFound();

  const waLink = generateWhatsAppLink({
    propertyTitle: property.title,
    propertyId: property.id,
    source: "property-detail",
  });
  const callLink = generateCallLink();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description.slice(0, 300),
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/properties/${property.slug}`,
    image: property.images.map((img) => img.url),
    offers: {
      "@type": "Offer",
      price: Number(property.price),
      priceCurrency: "INR",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: LOCALITY_LABELS[property.locality],
      addressRegion: "Maharashtra",
      addressCountry: "IN",
      streetAddress: property.address,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-[var(--color-surface-2)] pb-24 lg:pb-0">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[var(--color-border)]">
          <div className="container-main py-3">
            <nav className="text-sm text-[var(--color-text-muted)] flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-[var(--color-brand-600)]">Home</Link>
              <ChevronRight size={13} />
              <Link href="/properties" className="hover:text-[var(--color-brand-600)]">Properties</Link>
              <ChevronRight size={13} />
              <Link href={`/localities/${property.locality.toLowerCase().replace("_", "-")}`} className="hover:text-[var(--color-brand-600)]">
                {LOCALITY_LABELS[property.locality]}
              </Link>
              <ChevronRight size={13} />
              <span className="text-[var(--color-text-secondary)] truncate max-w-xs">{property.title}</span>
            </nav>
          </div>
        </div>

        <div className="container-main py-6">
          <div className="flex gap-6 flex-col lg:flex-row">
            {/* ── Left: Main Content ── */}
            <div className="flex-1 min-w-0">

              {/* Image Gallery */}
              <div className="card overflow-hidden mb-5">
                <div className="relative">
                  <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-72 md:h-96">
                    {/* Primary (large) */}
                    <div className="col-span-4 md:col-span-3 row-span-2 relative">
                      {property.images[0] && (
                        <Image
                          src={property.images[0].url}
                          alt={property.images[0].altText ?? property.title}
                          fill
                          className="object-cover"
                          priority
                          sizes="(max-width: 768px) 100vw, 60vw"
                        />
                      )}
                    </div>
                    {/* Thumbnails */}
                    {property.images.slice(1, 3).map((img, i) => (
                      <div key={img.id} className="hidden md:block relative col-span-1 row-span-1">
                        <Image
                          src={img.url}
                          alt={img.altText ?? `Photo ${i + 2}`}
                          fill
                          className="object-cover"
                          sizes="20vw"
                        />
                        {i === 1 && property.images.length > 3 && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">+{property.images.length - 3}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title & Badges */}
              <div className="card p-5 mb-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="badge badge-blue">{PROPERTY_SUB_TYPE_LABELS[property.subType]}</span>
                  <span className={`badge ${property.possession === "READY_TO_MOVE" ? "badge-green" : property.possession === "NEW_LAUNCH" ? "badge-blue" : "badge-amber"}`}>
                    {POSSESSION_LABELS[property.possession]}
                  </span>
                  {property.reraNumber && (
                    <span className="badge badge-slate">
                      <ShieldCheck size={11} />
                      RERA: {property.reraNumber}
                    </span>
                  )}
                </div>

                <h1 className="text-xl md:text-2xl font-extrabold text-[var(--color-text-primary)] leading-snug mb-2">
                  {property.title}
                </h1>

                <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)] text-sm mb-4">
                  <MapPin size={14} className="text-[var(--color-brand-400)] shrink-0" />
                  {property.address}
                  {property.landmark && ` · Near ${property.landmark}`}
                </div>

                {/* Key Specs Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-[var(--color-border)]">
                  {property.bhk && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <BedDouble size={16} className="text-[var(--color-brand-500)]" />
                        <span className="font-bold text-[var(--color-text-primary)]">{property.bhk} BHK</span>
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">Configuration</span>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Maximize2 size={16} className="text-[var(--color-brand-500)]" />
                      <span className="font-bold text-[var(--color-text-primary)]">{property.area.toLocaleString()} sq ft</span>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">Built-up Area</span>
                  </div>
                  {property.floor && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Building2 size={16} className="text-[var(--color-brand-500)]" />
                        <span className="font-bold text-[var(--color-text-primary)]">
                          {property.floor}{property.totalFloors ? `/${property.totalFloors}` : ""}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">Floor</span>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <CalendarCheck size={16} className="text-[var(--color-brand-500)]" />
                      <span className="font-bold text-[var(--color-text-primary)] text-sm">
                        {POSSESSION_LABELS[property.possession].replace("Ready to Move", "RTM")}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">Possession</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="card p-5 mb-5">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">About This Property</h2>
                <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                  {property.description}
                </div>
              </div>

              {/* Amenities */}
              <div className="card p-5 mb-5">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <CheckCircle2 size={15} className="text-[var(--color-brand-500)] shrink-0" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="card p-5 mb-5">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">Location</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                  {property.address}
                  {property.landmark && ` · Landmark: ${property.landmark}`}
                </p>
                <div className="rounded-xl overflow-hidden h-48 bg-[var(--color-surface-3)] flex items-center justify-center">
                  <a
                    href={property.googleMapsUrl ?? `https://maps.google.com/?q=${encodeURIComponent(property.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    <MapPin size={16} />
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* ── Right: Contact Sidebar ── */}
            <div className="lg:w-80 shrink-0">
              <div className="card p-5 sticky top-24">
                {/* Price */}
                <div className="mb-5">
                  <div className="price-tag text-3xl">{property.priceLabel}</div>
                  {property.priceNegotiable && (
                    <span className="text-xs text-[var(--color-text-muted)] mt-1 block">Price negotiable</span>
                  )}
                  {property.carpetArea && (
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      ₹{Math.round(Number(property.price) / property.carpetArea).toLocaleString("en-IN")}/sq ft
                      · Carpet: {property.carpetArea} sq ft
                    </p>
                  )}
                </div>

                <div className="divider my-4" />

                {/* Primary CTA — WhatsApp */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="property-whatsapp-cta"
                  className="btn btn-whatsapp w-full mb-3 py-3.5 text-base"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.057 23.927l6.236-1.637A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.369l-.359-.214-3.717.976.993-3.624-.234-.372A9.818 9.818 0 0112 2.182c5.421 0 9.818 4.397 9.818 9.818S17.421 21.818 12 21.818z" />
                  </svg>
                  Enquire on WhatsApp
                </a>

                {/* Secondary CTA — Call */}
                <a
                  href={callLink}
                  id="property-call-cta"
                  className="btn btn-outline w-full mb-4"
                >
                  <Phone size={17} />
                  Call Now
                </a>

                {/* Callback Form */}
                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                    📋 Request a Callback
                  </p>
                  <form className="space-y-2.5">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="input text-sm py-2.5"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="input text-sm py-2.5"
                      required
                    />
                    <button type="submit" className="btn btn-primary w-full py-2.5 text-sm">
                      Request Callback
                    </button>
                  </form>
                  <p className="text-xs text-[var(--color-text-muted)] mt-2 text-center">
                    We&apos;ll call you back within 30 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          <section className="mt-10">
            <h2 className="text-xl font-extrabold text-[var(--color-text-primary)] mb-5">
              Similar Properties
            </h2>
            <div className="property-grid">
              {SIMILAR_PROPERTIES.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <StickyContactBar
        propertyTitle={property.title}
        propertyId={property.id}
      />
    </>
  );
}
