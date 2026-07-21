import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import PropertyCard from "@/components/public/PropertyCard";
import StickyContactBar from "@/components/public/StickyContactBar";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { sortProperties } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { getPublicSettings } from "@/app/admin/(dashboard)/settings/actions";
import type { PropertyCardData } from "@/types";


// Temporary fallback for legacy Navi Mumbai content
const LOCALITY_CONTENT: Record<
  string,
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
  MAHAPE: {
    description: "Mahape is a major industrial and IT hub in Navi Mumbai, known for the Millennium Business Park and expanding residential developments.",
    priceRange: "₹60 Lakhs – ₹1.5 Crores",
    connectivity: "Well-connected via Thane-Belapur Road and nearby Ghansoli/Kopar Khairane railway stations.",
    highlights: ["Millennium Business Park", "IT Hub", "Industrial Estate", "Emerging Residential"],
  },
};

async function getLocationNode(stateSlug: string, citySlug: string, localitySlug: string) {
  const node = await prisma.locationNode.findFirst({
    where: { 
      slug: localitySlug,
      city: {
        slug: citySlug,
        state: {
          slug: stateSlug
        }
      }
    },
    include: {
      city: {
        include: {
          state: true
        }
      }
    }
  });
  return node;
}

async function getLocalityProperties(locationId: string) {
  const raws = await prisma.property.findMany({
    where: { 
      status: { in: ["ACTIVE", "SOLD", "RENTED"] }, 
      locationId
    },
    include: { images: { orderBy: { order: "asc" }, take: 1 }, locationNode: true, city: { include: { state: true } } },
    orderBy: { createdAt: "desc" },
  });
  return sortProperties(raws.map((p) => ({ ...p, price: Number(p.price) })) as unknown as PropertyCardData[]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string; locality: string }>;
}): Promise<Metadata> {
  const { state, city, locality } = await params;
  const node = await getLocationNode(state, city, locality);
  
  if (!node) return { title: "Location Not Found" };

  const label = node.name;
  const title = `Properties in ${label}, ${node.city.name} — Flats & Apartments | PropConnect`;
  
  const legacyKey = label.toUpperCase().replace(/ /g, '_');
  const legacyContent = LOCALITY_CONTENT[legacyKey];
  
  const description = legacyContent 
    ? `Find residential and commercial properties in ${label}, ${node.city.name}. Browse verified flats, apartments, villas, and plots. ${legacyContent.priceRange}. WhatsApp us today.`
    : `Find the best residential and commercial properties in ${label}, ${node.city.name}. Browse verified flats, apartments, and more on PropConnect.`;
    
  const url = `/locations/${state}/${city}/${locality}`;

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

export default async function LocationDirectoryPage({
  params,
}: {
  params: Promise<{ state: string; city: string; locality: string }>;
}) {
  const { state, city, locality } = await params;
  const node = await getLocationNode(state, city, locality);
  if (!node) notFound();

  const label = node.name;
  const legacyKey = label.toUpperCase().replace(/ /g, '_');
  const content = LOCALITY_CONTENT[legacyKey] || {
    description: `Discover top properties in ${label}, ${node.city.name}. Whether you are looking for an apartment, villa, or commercial space, find the best options here.`,
    priceRange: "Various options available",
    connectivity: `Well connected within ${node.city.name}.`,
    highlights: ["Great Location", "Growing Area", "Investment Potential"]
  };
  
  const properties = await getLocalityProperties(node.id);
  const settings = await getPublicSettings().catch(() => ({} as Record<string, string>));
  const waLink = generateWhatsAppLink({ source: `location-${node.slug}`, settings });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/locations/${state}/${city}/${locality}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Properties in ${label}, ${node.city.name}`,
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
        name: node.city.state.name,
        item: `${baseUrl}/properties?state=${state}`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: node.city.name,
        item: `${baseUrl}/properties?city=${city}`
      },
      {
        "@type": "ListItem",
        position: 5,
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

      <div className="bg-[var(--color-surface-2)] min-h-[100dvh]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[var(--color-border)]">
          <div className="container-main py-3">
            <nav className="text-sm text-[var(--color-text-muted)] flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-[var(--color-brand-600)]">Home</Link>
              <ChevronRight size={13} />
              <Link href="/properties" className="hover:text-[var(--color-brand-600)]">Properties</Link>
              <ChevronRight size={13} />
              <span className="text-[var(--color-text-secondary)] truncate">{node.city.name}</span>
              <ChevronRight size={13} />
              <span className="text-[var(--color-text-secondary)] font-medium truncate">{label}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white border-b border-[var(--color-border)] pb-8 pt-6">
          <div className="container-main">
            <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-3">
              Properties in {label}, {node.city.name}
            </h1>
            <p className="text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
              {content.description}
            </p>
            
            <div className="flex flex-wrap gap-x-8 gap-y-4 mt-6 pt-6 border-t border-[var(--color-border)]">
              {content.priceRange && (
                <div>
                  <div className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Avg Price Range</div>
                  <div className="font-medium text-[var(--color-text-primary)]">{content.priceRange}</div>
                </div>
              )}
              {content.connectivity && (
                <div>
                  <div className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Connectivity</div>
                  <div className="font-medium text-[var(--color-text-primary)]">{content.connectivity}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container-main py-8">
          <div className="flex gap-8 flex-col lg:flex-row">
            {/* Left: Main Properties */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                  {properties.length} Properties Found
                </h2>
                <Link href={`/properties?locality=${node.slug}`} className="text-sm font-medium text-[var(--color-brand-600)] hover:underline">
                  Filter & Sort &rarr;
                </Link>
              </div>

              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <div className="w-16 h-16 bg-[var(--color-brand-50)] text-[var(--color-brand-600)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                    No properties found
                  </h3>
                  <p className="text-[var(--color-text-secondary)] max-w-md mx-auto mb-6">
                    We couldn&apos;t find any active properties in {label} right now. Check back later or contact us.
                  </p>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Contact Us
                  </a>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              <div className="card p-5">
                <h3 className="font-bold text-[var(--color-text-primary)] mb-4">Locality Highlights</h3>
                <ul className="space-y-3">
                  {content.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-600)] flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-sm text-[var(--color-text-secondary)]">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StickyContactBar />
    </>
  );
}
