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
} from "@/types";
import { prisma } from "@/lib/prisma";
import { getPublicSettings } from "@/app/admin/(dashboard)/settings/actions";
import type { PropertyCardData } from "@/types";

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
  DELHI: {
    description: "The capital city offers a unique blend of historical charm and modern living, featuring exclusive independent houses and luxury apartments.",
    priceRange: "₹80 Lakhs – ₹5+ Crores",
    connectivity: "Excellent connectivity via the extensive Delhi Metro network, ring roads, and national highways.",
    highlights: ["Capital City", "Extensive Metro", "Spacious Layouts", "Green Surroundings"],
  },
  BANGALORE: {
    description: "Known as the Silicon Valley of India, Bangalore boasts premium high-rise living and lush green spaces.",
    priceRange: "₹60 Lakhs – ₹3 Crores",
    connectivity: "Well connected by Namma Metro, BMTC, and an expanding ring road network.",
    highlights: ["IT Hub", "Pleasant Climate", "Premium High-Rises", "Cosmopolitan Culture"],
  },
  PUNE: {
    description: "A fast-emerging IT hub with excellent weather, offering a great balance of work and life with affordable luxury.",
    priceRange: "₹45 Lakhs – ₹2 Crores",
    connectivity: "Connectivity through the upcoming Pune Metro and a strong local bus network.",
    highlights: ["Educational Hub", "Emerging IT Hub", "Great Weather", "Affordable Luxury"],
  },
  HYDERABAD: {
    description: "The fastest growing metropolis with modern infrastructure, famous for its IT corridors and rich heritage.",
    priceRange: "₹55 Lakhs – ₹2.5 Crores",
    connectivity: "Robust connectivity via Hyderabad Metro and Outer Ring Road.",
    highlights: ["Modern Infrastructure", "IT Corridors", "Affordable High-End Living", "Rich Heritage"],
  },
  CHENNAI: {
    description: "A major cultural and economic center offering coastal living and traditional neighborhoods with modern amenities.",
    priceRange: "₹50 Lakhs – ₹3 Crores",
    connectivity: "Served by Chennai Metro, MRTS, and an extensive local train and bus network.",
    highlights: ["Cultural Hub", "Coastal Living", "Automobile Hub", "Excellent Education"],
  },
};

// Demo properties for locality pages
async function getLocalityProperties(locality: Locality) {
  const raws = await prisma.property.findMany({
    where: { status: "ACTIVE", locality },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });
  return raws.map((p) => ({ ...p, price: Number(p.price) })) as unknown as PropertyCardData[];
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
