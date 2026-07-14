import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import PropertyCard from "@/components/public/PropertyCard";
import StickyContactBar from "@/components/public/StickyContactBar";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { sortProperties } from "@/lib/utils";
import {
  LOCALITY_LABELS,
  SLUG_TO_LOCALITY,
  type Locality,
} from "@/types";
import { prisma } from "@/lib/prisma";
import { getPublicSettings } from "@/app/admin/(dashboard)/settings/actions";
import type { PropertyCardData } from "@/types";

// Locality-specific SEO content
const LOCALITY_CONTENT: Record<
  Locality,
  { description: string; priceRange: string; connectivity: string; highlights: string[] }
> = {
  SEAWOODS: {
    description: "Seawoods is a premium residential node known for its luxury high-rises, Grand Central Mall, and well-planned infrastructure.",
    priceRange: "₹1.5 Crores – ₹4 Crores",
    connectivity: "Connected via Seawoods-Darave railway station on the Harbour line and Palm Beach Road.",
    highlights: ["Seawoods Grand Central Mall", "Premium High-Rises", "Palm Beach Road Access", "NRI Complex"],
  },
  KHARGHAR: {
    description: "Kharghar is a well-planned, green node recognized as the educational hub of Navi Mumbai with large open spaces and Central Park.",
    priceRange: "₹80 Lakhs – ₹3 Crores",
    connectivity: "Excellent connectivity via Sion-Panvel Highway, Harbour line railway, and the upcoming Metro.",
    highlights: ["Central Park", "Educational Institutions", "Kharghar Valley Golf Course", "Upcoming Metro"],
  },
  TALOJA: {
    description: "Taloja is an emerging affordable housing destination with rapid infrastructure growth and industrial presence.",
    priceRange: "₹35 Lakhs – ₹80 Lakhs",
    connectivity: "Connected via Taloja Panchanand railway station and Navi Mumbai Metro Line 1.",
    highlights: ["Affordable Housing", "Metro Connectivity", "Industrial Hub", "Upcoming Projects"],
  },
  NERUL: {
    description: "Known as the Queen of Navi Mumbai, Nerul boasts excellent residential complexes, educational institutes, and the iconic DY Patil Stadium.",
    priceRange: "₹1 Crore – ₹3.5 Crores",
    connectivity: "Served by Nerul railway station on the Harbour line and Sion-Panvel Highway.",
    highlights: ["DY Patil Stadium", "Established Node", "Premium Residential", "Educational Hub"],
  },
  VASHI: {
    description: "Vashi is the oldest and most established commercial and residential hub of Navi Mumbai, offering excellent shopping and dining experiences.",
    priceRange: "₹1.5 Crores – ₹5 Crores",
    connectivity: "First node on the Sion-Panvel Highway after the bridge, connected by Vashi railway station.",
    highlights: ["Commercial Hub", "Inorbit Mall", "Established Infrastructure", "Excellent Connectivity"],
  },
  CBD_BELAPUR: {
    description: "CBD Belapur is the primary business district of Navi Mumbai, featuring major corporate offices alongside premium residential areas.",
    priceRange: "₹1 Crore – ₹4 Crores",
    connectivity: "Connected by Belapur railway station and water taxi services to Mumbai.",
    highlights: ["Central Business District", "Water Taxi", "Corporate Offices", "Hillside Views"],
  },
  AIROLI: {
    description: "Airoli is a major IT and knowledge corridor of Navi Mumbai with excellent connectivity to Thane and Eastern suburbs.",
    priceRange: "₹90 Lakhs – ₹2.5 Crores",
    connectivity: "Direct connectivity to Mulund via Airoli Bridge and served by Airoli railway station.",
    highlights: ["IT Parks", "Knowledge Corridor", "Airoli Bridge", "Green Spaces"],
  },
  GHANSOLI: {
    description: "Ghansoli is a rapidly developing node with large IT parks, corporate parks, and modern residential developments.",
    priceRange: "₹80 Lakhs – ₹2 Crores",
    connectivity: "Connected via Trans-Harbour line and Thane-Belapur road.",
    highlights: ["Reliance Corporate Park", "Developing Infrastructure", "Trans-Harbour Connectivity", "Modern Housing"],
  },
  ULWE: {
    description: "Ulwe is a fast-emerging node located close to the upcoming Navi Mumbai International Airport, offering great investment potential.",
    priceRange: "₹50 Lakhs – ₹1.5 Crores",
    connectivity: "Connected by Bamandongri and Kharkopar railway stations and close to Atal Setu (MTHL).",
    highlights: ["Proximity to Airport", "Atal Setu Access", "High ROI Potential", "New Developments"],
  },
  KAMOTHE: {
    description: "Kamothe is a dense residential node offering affordable to mid-range housing options with good social infrastructure.",
    priceRange: "₹60 Lakhs – ₹1.2 Crores",
    connectivity: "Well-connected via Mansarovar and Khandeshwar railway stations and Sion-Panvel Highway.",
    highlights: ["Mid-Range Housing", "Good Accessibility", "Established Market", "Close to Panvel"],
  },
  SANPADA: {
    description: "Sanpada is a premium residential area situated between Vashi and Nerul, offering well-planned layouts and peaceful living.",
    priceRange: "₹1.2 Crores – ₹3 Crores",
    connectivity: "Served by Sanpada railway station and Palm Beach Road.",
    highlights: ["Premium Layouts", "Palm Beach Road", "Peaceful Environment", "Good Schools"],
  },
  KALAMBOLI: {
    description: "Kalamboli is a major transportation and logistics hub, featuring affordable housing and good highway connectivity.",
    priceRange: "₹45 Lakhs – ₹90 Lakhs",
    connectivity: "Situated at the junction of Sion-Panvel Highway, NH4, and Mumbai-Pune Expressway.",
    highlights: ["Highway Junction", "Logistics Hub", "Affordable Housing", "Expressway Access"],
  },
  PANVEL: {
    description: "Panvel is an emerging smart city and the gateway to the Konkan region, set to benefit massively from the upcoming international airport.",
    priceRange: "₹45 Lakhs – ₹2 Crores",
    connectivity: "Major railway junction connecting Harbour, Central, and Outstation lines.",
    highlights: ["Upcoming Airport", "Major Railway Junction", "Smart City Projects", "Gateway to Konkan"],
  },
};

// Demo properties for locality pages
async function getLocalityProperties(locality: Locality) {
  const raws = await prisma.property.findMany({
    where: { status: { in: ["ACTIVE", "SOLD", "RENTED"] }, locality },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });
  return sortProperties(raws.map((p) => ({ ...p, price: Number(p.price) })) as unknown as PropertyCardData[]);
}

export async function generateStaticParams() {
  return Object.keys(SLUG_TO_LOCALITY).map((slug) => ({ locality: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locality: string }>;
}): Promise<Metadata> {
  const { locality: slug } = await params;
  const locality = SLUG_TO_LOCALITY[slug];
  if (!locality) return { title: "Locality Not Found" };

  const label = LOCALITY_LABELS[locality];
  const title = `Properties in ${label} — Flats, Apartments & More | PropConnect`;
  const description = `Find residential and commercial properties in ${label}. Browse verified flats, apartments, villas, and plots. ${LOCALITY_CONTENT[locality].priceRange}. WhatsApp us today.`;
  const url = `/localities/${slug}`;

  return {
    title,
    description,
    keywords: [`property in ${label.toLowerCase()}`, `flats in ${label.toLowerCase()}`, `apartments ${label.toLowerCase()}`, `buy property ${label.toLowerCase()}`],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocalityPage({
  params,
}: {
  params: Promise<{ locality: string }>;
}) {
  const { locality: slug } = await params;
  const localityKey = SLUG_TO_LOCALITY[slug];
  if (!localityKey) notFound();

  const label = LOCALITY_LABELS[localityKey];
  const content = LOCALITY_CONTENT[localityKey];
  const properties = await getLocalityProperties(localityKey);
  const settings = await getPublicSettings().catch(() => ({} as Record<string, string>));
  const waLink = generateWhatsAppLink({ source: `locality-${slug}`, settings });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/localities/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Properties in ${label}`,
    description: content.description,
    url: url,
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
        name: label,
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
      {/* Hero */}
      <div className="hero-gradient py-14">
        <div className="container-main">
          <nav className="text-sm mb-4 flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.65)" }}>
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={13} />
            <Link href="/properties" className="hover:text-white">Properties</Link>
            <ChevronRight size={13} />
            <span className="text-white">{label}</span>
          </nav>
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
            >
              <MapPin size={22} color="white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Properties in {label}
              </h1>
              <p className="text-base mt-2" style={{ color: "rgba(255,255,255,0.75)" }}>
                {content.priceRange} · Verified Listings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-main py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Properties Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                Available Properties ({properties.length})
              </h2>
              <Link
                href={`/properties?locality=${localityKey}`}
                className="text-sm font-semibold text-[var(--color-brand-600)] hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="property-grid lg:[grid-template-columns:repeat(2,1fr)]">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* About Locality */}
            <div className="card p-5">
              <h2 className="font-bold text-[var(--color-text-primary)] mb-3">About {label}</h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                {content.description}
              </p>
              <div className="space-y-2">
                {content.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <span className="w-5 h-5 rounded-full bg-[var(--color-brand-100)] flex items-center justify-center shrink-0">
                      <span className="text-[var(--color-brand-600)] text-xs">✓</span>
                    </span>
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* Connectivity */}
            <div className="card p-5">
              <h3 className="font-bold text-[var(--color-text-primary)] mb-2">🚆 Connectivity</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{content.connectivity}</p>
            </div>

            {/* WhatsApp CTA */}
            <div className="card p-5 text-center" style={{ background: "var(--color-brand-50)", border: "1.5px solid var(--color-brand-200)" }}>
              <p className="font-bold text-[var(--color-brand-800)] mb-1">
                Looking for a property in {label}?
              </p>
              <p className="text-sm text-[var(--color-brand-700)] mb-4">
                Our experts know {label} inside out. Chat with us for personalized recommendations.
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp w-full"
              >
                💬 WhatsApp for {label} Properties
              </a>
            </div>
          </div>
        </div>
      </div>

      <StickyContactBar />
    </>
  );
}
