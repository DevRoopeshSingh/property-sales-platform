import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import PropertyCard from "@/components/public/PropertyCard";
import StickyContactBar from "@/components/public/StickyContactBar";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import {
  LOCALITY_LABELS,
  SLUG_TO_LOCALITY,
  type Locality,
  type PropertySubType,
  type Possession,
} from "@/types";

// Locality-specific SEO content
const LOCALITY_CONTENT: Record<
  Locality,
  { description: string; priceRange: string; connectivity: string; highlights: string[] }
> = {
  VIRAR: {
    description: "Virar is one of the fastest-growing residential destinations in the Mumbai Metropolitan Region, offering affordable housing options with excellent railway connectivity to Mumbai Central.",
    priceRange: "₹25 Lakhs – ₹80 Lakhs",
    connectivity: "Virar is served by the Western Railway line with fast and slow trains running frequently to Churchgate and Dadar.",
    highlights: ["Western Railway Station", "Affordable Property Rates", "Upcoming Metro Extension", "Natural Surroundings"],
  },
  VASAI: {
    description: "Vasai offers a perfect balance of affordable living and modern infrastructure. With rapid development and upcoming metro connectivity, it is emerging as a prime residential destination.",
    priceRange: "₹30 Lakhs – ₹1.2 Crores",
    connectivity: "Vasai Road station connects to both Central and Western railway lines, offering excellent access to Mumbai.",
    highlights: ["Dual Railway Lines", "Growing Infrastructure", "Modern Townships", "Good Schools & Hospitals"],
  },
  NALASOPARA: {
    description: "Nalasopara is one of the most affordable residential areas in the Mumbai region, with a large selection of new developments and improving infrastructure.",
    priceRange: "₹20 Lakhs – ₹75 Lakhs",
    connectivity: "Nallasopara station on the Western Railway line provides direct connectivity to Mumbai.",
    highlights: ["Most Affordable in MMR", "Western Railway Connectivity", "New Residential Projects", "Growing Commercial Hub"],
  },
  THANE: {
    description: "Thane has transformed into a premier urban destination with world-class infrastructure, top schools, hospitals, and malls. It offers a premium living experience with excellent connectivity.",
    priceRange: "₹60 Lakhs – ₹3 Crores",
    connectivity: "Thane is connected via Central Railway and the upcoming Metro Line 4 linking it directly to Wadala.",
    highlights: ["Top Schools & Hospitals", "Lakes & Parks", "Metro Connectivity", "IT & Commercial Hubs"],
  },
  NAVI_MUMBAI: {
    description: "Navi Mumbai is a planned city known for wide roads, greenery, and excellent civic infrastructure. It is one of the most livable cities in Maharashtra.",
    priceRange: "₹55 Lakhs – ₹2.5 Crores",
    connectivity: "Navi Mumbai has Harbour Line connectivity and is set to get the new Navi Mumbai International Airport.",
    highlights: ["Planned City", "Wide Roads & Green Spaces", "New International Airport", "Top IT Parks"],
  },
  MIRA_ROAD: {
    description: "Mira Road is a rapidly developing suburb with a mix of affordable and mid-range housing. Its proximity to Mira-Bhayandar Municipal Corporation areas makes it a popular choice for families.",
    priceRange: "₹40 Lakhs – ₹1.5 Crores",
    connectivity: "Mira Road station on the Western Railway line provides fast access to Mumbai.",
    highlights: ["Affordable Mid-Range Housing", "Good Social Infrastructure", "Western Railway Access", "Upcoming Projects"],
  },
  BHAYANDAR: {
    description: "Bhayandar is an emerging residential locality that offers affordable housing options with good connectivity and a growing social infrastructure.",
    priceRange: "₹35 Lakhs – ₹1.2 Crores",
    connectivity: "Bhayandar station on the Western Railway line connects easily to Mumbai and Virar.",
    highlights: ["Affordable Housing", "Western Railway", "Sea-Facing Options", "Good Amenities"],
  },
  NAIGAON: {
    description: "Naigaon has emerged as a popular affordable housing destination, offering a peaceful environment with good connectivity to both Vasai and Mumbai.",
    priceRange: "₹22 Lakhs – ₹70 Lakhs",
    connectivity: "Naigaon station provides connectivity on the Western Railway line.",
    highlights: ["Most Budget Friendly", "Peaceful Environment", "New Developments", "Good ROI Potential"],
  },
  MUMBAI: {
    description: "Mumbai is the financial capital of India, offering premium residential and commercial properties across its various neighborhoods from Andheri to South Mumbai.",
    priceRange: "₹80 Lakhs – ₹10+ Crores",
    connectivity: "Mumbai is served by the Western, Central, and Harbour railway lines, BEST buses, and a growing Metro network.",
    highlights: ["Financial Capital", "Premium Addresses", "Metro Network", "World-Class Amenities"],
  },
};

// Demo properties for locality pages
const DEMO_PROPERTIES = (locality: Locality) =>
  Array.from({ length: 6 }, (_, i) => ({
    id: `${locality}-${i}`,
    title: `${i % 2 === 0 ? "2BHK" : "3BHK"} Apartment in ${LOCALITY_LABELS[locality]}`,
    slug: `${locality.toLowerCase()}-property-${i + 1}`,
    type: "RESIDENTIAL" as const,
    subType: "APARTMENT" as PropertySubType,
    status: "ACTIVE" as const,
    featured: i === 0,
    price: 4000000 + i * 500000,
    priceLabel: `₹${40 + i * 5} Lakhs`,
    bhk: i % 2 === 0 ? 2 : 3,
    area: 750 + i * 100,
    floor: i + 2,
    locality,
    address: `Sample Address, ${LOCALITY_LABELS[locality]}`,
    possession: (i < 2 ? "READY_TO_MOVE" : i < 4 ? "UNDER_CONSTRUCTION" : "NEW_LAUNCH") as Possession,
    images: [],
    createdAt: new Date(),
  }));

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
  return {
    title: `Properties in ${label} — Flats, Apartments & More | PropConnect`,
    description: `Find residential and commercial properties in ${label}. Browse verified flats, apartments, villas, and plots. ${LOCALITY_CONTENT[locality].priceRange}. WhatsApp us today.`,
    keywords: [`property in ${label.toLowerCase()}`, `flats in ${label.toLowerCase()}`, `apartments ${label.toLowerCase()}`, `buy property ${label.toLowerCase()}`],
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
  const properties = DEMO_PROPERTIES(localityKey);
  const waLink = generateWhatsAppLink({ source: `locality-${slug}` });

  return (
    <>
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
