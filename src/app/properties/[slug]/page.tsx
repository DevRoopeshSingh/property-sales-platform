import type { Metadata } from "next";
import Link from "next/link";
import PropertyGallery from "@/components/public/PropertyGallery";
import { notFound } from "next/navigation";
import {
  MapPin, BedDouble, Maximize2, Building2, CalendarCheck,
  ShieldCheck, Phone, CheckCircle2, ChevronRight
} from "lucide-react";
import StickyContactBar from "@/components/public/StickyContactBar";
import PropertyCard from "@/components/public/PropertyCard";
import CallbackForm from "@/components/public/CallbackForm";
import ShareButton from "@/components/public/ShareButton";
import SaveButton from "@/components/public/SaveButton";
import ExpandableDescription from "@/components/public/ExpandableDescription";
import EmiCalculator from "@/components/public/EmiCalculator";
import PriceInsightsModule from "@/components/public/PriceInsightsModule";
import ParkingDetails from "@/components/public/ParkingDetails";
import { prisma } from "@/lib/prisma";
import { sortProperties } from "@/lib/utils";
import { generateWhatsAppLink, generateCallLink } from "@/lib/whatsapp";
import { getPublicSettings } from "@/app/admin/(dashboard)/settings/actions";
import type { PropertyCardData, PropertyDetail } from "@/types";
import {
  LOCALITY_LABELS,
  PROPERTY_SUB_TYPE_LABELS,
  POSSESSION_LABELS,
  type Locality,
  type PropertySubType,
} from "@/types";


async function getProperty(slug: string) {
  const raw = await prisma.property.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!raw) return null;
  return { 
    ...raw, 
    price: Number(raw.price),
    marketEstimateMin: raw.marketEstimateMin ? Number(raw.marketEstimateMin) : null,
    marketEstimateMax: raw.marketEstimateMax ? Number(raw.marketEstimateMax) : null,
  };
}

async function getSimilarProperties(locality: string, excludeId: string) {
  const raws = await prisma.property.findMany({
    where: { status: { in: ["ACTIVE", "SOLD", "RENTED"] }, locality: locality as Locality, id: { not: excludeId } },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    take: 3,
    orderBy: { featured: "desc" },
  });
  return sortProperties(raws.map((p) => ({ ...p, price: Number(p.price) })) as unknown as PropertyCardData[]);
}


export async function generateStaticParams() {
  const properties = await prisma.property.findMany({
    where: { status: { in: ["ACTIVE", "SOLD", "RENTED"] } },
    select: { slug: true },
  });
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  const settings = await getPublicSettings().catch(() => ({} as Record<string, string>));
  if (!property) return { title: "Property Not Found" };

  const title = property.metaTitle ?? `${property.title}${settings.seoDefaultTitleSuffix || " | PropConnect"}`;
  const description = property.metaDescription ?? (property.description.slice(0, 160) || settings.seoDefaultDescription);
  const url = `/properties/${property.slug}`;
  const images = property.images.length > 0
    ? property.images.map((img) => ({ url: img.url, alt: property.title }))
    : [{ url: '/icon.png', alt: property.title }];

  return {
    title,
    description,
    keywords: [
      `property in ${LOCALITY_LABELS[property.locality as Locality]?.toLowerCase()}`,
      property.bhk ? `${property.bhk} BHK` : "",
      PROPERTY_SUB_TYPE_LABELS[property.subType as PropertySubType]?.toLowerCase(),
    ].filter(Boolean),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map(img => img.url),
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const property = await getProperty(slug);
  if (!property) notFound();

  const similarProperties = await getSimilarProperties(property.locality, property.id);
  const settings = await getPublicSettings().catch(() => ({} as Record<string, string>));

  const waLink = generateWhatsAppLink({
    propertyTitle: property.title,
    propertyId: property.id,
    source: "property-detail",
    settings,
    builderName: property.builderName,
    locality: LOCALITY_LABELS[property.locality] ?? property.locality,
    bhk: property.bhk,
    area: property.area,
    priceLabel: property.priceLabel,
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/properties/${property.slug}`,
  });
  const callLink = generateCallLink(settings.supportPhone);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/properties/${property.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description.slice(0, 300),
    url: url,
    image: property.images.length > 0 ? property.images.map((img) => img.url) : [`${baseUrl}/icon.png`],
    offers: {
      "@type": "Offer",
      price: Number(property.price),
      priceCurrency: "INR",
      url: url,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: LOCALITY_LABELS[property.locality],
      addressRegion: "Maharashtra",
      addressCountry: "IN",
      streetAddress: property.address,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Properties",
        item: `${baseUrl}/properties`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: LOCALITY_LABELS[property.locality],
        item: `${baseUrl}/localities/${property.locality.toLowerCase().replace("_", "-")}`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: property.title,
        item: url
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
              <PropertyGallery images={property.images} title={property.title} />

              {/* Title & Badges */}
              <div className="card p-5 mb-5">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {property.status === 'SOLD' && (
                        <span className="badge bg-red-600 text-white border-transparent">SOLD</span>
                      )}
                      {property.status === 'RENTED' && (
                        <span className="badge bg-purple-600 text-white border-transparent">RENTED</span>
                      )}
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
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 shrink-0 mt-1">
                    <SaveButton 
                      propertyId={property.id}
                      className="text-[var(--color-text-secondary)] hover:text-red-600 bg-white hover:bg-red-50 px-4 py-2 rounded-full border border-[var(--color-border)] hover:border-red-200 shadow-sm"
                    />
                    <ShareButton 
                      title={property.title} 
                      url={url} 
                      className="text-[var(--color-brand-600)] hover:text-[var(--color-brand-700)] bg-white hover:bg-[var(--color-brand-50)] px-4 py-2 rounded-full border border-[var(--color-brand-200)] shadow-sm transition-all duration-200 active:scale-95"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[var(--color-text-secondary)] text-sm mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[var(--color-brand-400)] shrink-0" />
                    <span>{property.address}</span>
                    {property.landmark && <span>· Near {property.landmark}</span>}
                  </div>
                  <a href="#location" className="text-[var(--color-brand-600)] font-medium hover:underline text-xs bg-[var(--color-brand-50)] px-2 py-0.5 rounded-full whitespace-nowrap">
                    View on Map
                  </a>
                </div>

                {/* Key Specs Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-[var(--color-border)]">
                  {property.bhk && property.type !== "COMMERCIAL" && property.subType !== "OFFICE" ? (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <BedDouble size={16} className="text-[var(--color-brand-500)]" />
                        <span className="font-bold text-[var(--color-text-primary)]">{property.bhk} BHK</span>
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">Configuration</span>
                    </div>
                  ) : null}
                  {property.area ? (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Maximize2 size={16} className="text-[var(--color-brand-500)]" />
                        <span className="font-bold text-[var(--color-text-primary)]">{property.area.toLocaleString()} sq ft</span>
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">Carpet Area</span>
                    </div>
                  ) : null}
                  {property.totalFloors ? (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Building2 size={16} className="text-[var(--color-brand-500)]" />
                        <span className="font-bold text-[var(--color-text-primary)]">
                          {property.totalFloors}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">Total Floors</span>
                    </div>
                  ) : null}
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

              {/* Price Insights Module */}
              <PriceInsightsModule property={property as PropertyDetail} />

              {/* Parking Details Module */}
              <ParkingDetails property={property as PropertyDetail} />

              {/* Description */}
              <div className="card p-5 mb-5">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">About This Property</h2>
                <ExpandableDescription text={property.description} maxLines={4} />
                {property.subType === "OFFICE" && property.amenities.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Location Advantages:</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {property.amenities.join(", ")}
                    </p>
                  </div>
                )}
              </div>

              {/* Amenities / Location Advantages */}
              {property.subType !== "OFFICE" && (
                <div className="card p-5 mb-5">
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
                    {property.type === "COMMERCIAL" ? "Location Advantages" : "Amenities"}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <CheckCircle2 size={15} className="text-[var(--color-brand-500)] shrink-0" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EMI Calculator */}
              {property.price && Number(property.price) > 0 && (
                <EmiCalculator propertyPrice={Number(property.price)} />
              )}

              {/* Location */}
              <div id="location" className="card p-5 mb-5 scroll-mt-28">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">Location</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                  {property.address}
                  {property.landmark && ` · Landmark: ${property.landmark}`}
                </p>
                <div className="rounded-xl overflow-hidden h-64 bg-[var(--color-surface-3)]">
                  {property.googleMapsUrl?.includes('<iframe') ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: property.googleMapsUrl }} 
                      className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" 
                    />
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={property.googleMapsUrl?.includes('embed') ? property.googleMapsUrl : `https://maps.google.com/maps?q=${encodeURIComponent(property.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    />
                  )}
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
                  {property.duesPending && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-xs font-bold text-red-800 mb-1">Dues Pending</p>
                      <p className="text-xs text-red-600">{property.duesPending}</p>
                    </div>
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
                <div className="hidden lg:block" style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem", marginTop: "1rem" }}>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                    📋 Request a Callback
                  </p>
                  <CallbackForm propertyTitle={property.title} />
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
              {similarProperties.length > 0 ? similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              )) : (
                <p className="text-sm text-[var(--color-text-muted)] col-span-3">No similar properties found in this area yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>

      <StickyContactBar
        property={property}
      />
    </>
  );
}
