import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, CheckCircle, Shield, ChevronRight, MessageSquare, Award } from "lucide-react";
import PropertyCard from "@/components/public/PropertyCard";
import StickyContactBar from "@/components/public/StickyContactBar";
import HeroSearchClient from "@/components/public/HeroSearchClient";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { getPublicSettings } from "@/app/admin/(dashboard)/settings/actions";
import { LOCALITY_LABELS, type Locality, PropertyCardData } from "@/types";
import { sortProperties } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "PropConnect — Premium Properties in Navi Mumbai",
  description:
    "Discover premium residential and commercial properties in Navi Mumbai. Connect instantly on WhatsApp. 100% verified listings with zero brokerage.",
  keywords: "property in navi mumbai, luxury flats, zero brokerage, verified properties, new launch projects",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "PropConnect — Premium Properties in Navi Mumbai",
    description: "Discover premium residential and commercial properties in Navi Mumbai. Connect instantly on WhatsApp. 100% verified listings with zero brokerage.",
    url: '/',
  },
};

export const revalidate = 60;

const CATEGORIES = [
  { label: "Apartments", icon: "🏢", href: "/properties?subType=APARTMENT", subType: "APARTMENT" },
  { label: "Villas", icon: "🏡", href: "/properties?subType=VILLA", subType: "VILLA" },
  { label: "Independent Houses", icon: "🏠", href: "/properties?subType=INDEPENDENT_HOUSE", subType: "INDEPENDENT_HOUSE" },
  { label: "Row Houses", icon: "🏘️", href: "/properties?subType=ROW_HOUSE", subType: "ROW_HOUSE" },
  { label: "Plots", icon: "🗺️", href: "/properties?subType=PLOT", subType: "PLOT" },
  { label: "Offices", icon: "🏛️", href: "/properties?subType=OFFICE", subType: "OFFICE" },
  { label: "Shops", icon: "🏪", href: "/properties?subType=SHOP", subType: "SHOP" },
  { label: "Showrooms", icon: "🏬", href: "/properties?subType=SHOWROOM", subType: "SHOWROOM" },
];

const LOCALITIES_SHOWCASE: { key: Locality; desc: string; priceRange: string }[] = [
  { key: "VASHI", desc: "The commercial and residential hub of Navi Mumbai", priceRange: "₹1.5Cr–₹5Cr" },
  { key: "KHARGHAR", desc: "Well-planned node with green spaces and educational hubs", priceRange: "₹80L–₹3Cr" },
  { key: "SEAWOODS", desc: "Premium locality with luxury high-rises and mall access", priceRange: "₹1.5Cr–₹4Cr" },
  { key: "NERUL", desc: "Queen of Navi Mumbai with excellent connectivity", priceRange: "₹1Cr–₹3.5Cr" },
  { key: "CBD_BELAPUR", desc: "Major business district with premium housing", priceRange: "₹1Cr–₹4Cr" },
  { key: "PANVEL", desc: "Emerging smart city near the upcoming airport", priceRange: "₹45L–₹2Cr" },
];

const WHY_US = [
  {
    icon: <Shield size={24} className="text-[var(--color-brand-600)]" />,
    title: "100% Verified Listings",
    desc: "Every property is RERA-checked and personally verified by our team before it goes live.",
  },

  {
    icon: <MessageSquare size={24} className="text-[var(--color-brand-600)]" />,
    title: "Instant WhatsApp Support",
    desc: "Skip the spam calls. Chat with our dedicated property consultants instantly on WhatsApp.",
  },
  {
    icon: <Award size={24} className="text-[var(--color-brand-600)]" />,
    title: "Navi Mumbai Specialists",
    desc: "Hyperlocal experts covering top localities across Navi Mumbai with deep market insights.",
  },
];



const TESTIMONIALS = [
  { name: "Rahul D.", role: "First-time Buyer", content: "PropConnect made finding my first home in Kharghar incredibly easy. Their WhatsApp support was quick and they negotiated a great deal for me without any hidden fees.", rating: 5 },
  { name: "Sneha M.", role: "Investor", content: "I've bought two commercial properties through them. The fact that they deal directly with top builders and share authentic RERA verified details gives me immense peace of mind.", rating: 5 },
  { name: "Vikram P.", role: "Upgrading Home", content: "Loved the seamless experience. Instead of dealing with 10 different brokers, I just chatted with one expert who curated the best 3BHKs in Vashi for us.", rating: 5 }
];



export default async function HomePage() {
  const settings = await getPublicSettings().catch(() => ({} as Record<string, string>));
  const waLink = generateWhatsAppLink({ source: "homepage-hero", settings });

  const rawProperties = await prisma.property.findMany({
    where: { status: { in: ["ACTIVE", "SOLD", "RENTED"] } },
    take: 6,
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: [
      { featured: "desc" },
      { createdAt: "desc" }
    ],
  });

  const featuredProperties = sortProperties(rawProperties.map(p => ({
    ...p,
    price: Number(p.price),
  })) as unknown as PropertyCardData[]);

  const propertyCounts = await prisma.property.groupBy({
    by: ['subType'],
    where: { status: { in: ["ACTIVE", "SOLD", "RENTED"] } },
    _count: {
      _all: true
    }
  });
  
  const countMap = propertyCounts.reduce((acc, curr) => {
    acc[curr.subType] = curr._count._all;
    return acc;
  }, {} as Record<string, number>);

  const dynamicCategories = CATEGORIES.map(cat => ({
    ...cat,
    count: countMap[cat.subType] || 0
  }));

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PropConnect",
    url: baseUrl,
    logo: `${baseUrl}/icon.png`,
    description: "Discover premium residential and commercial properties in Navi Mumbai.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.supportPhone || "+91 98765 43210",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Premium Hero ── */}
      <section className="relative overflow-hidden bg-slate-900">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80" 
            alt="Premium Properties in Navi Mumbai" 
            fill 
            priority 
            className="object-cover object-center" 
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-transparent" />

        <div className="container-main relative z-10 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-up bg-white/10 text-white backdrop-blur-md border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Navi Mumbai&apos;s Premium Property Platform
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Find Your Perfect Property
              <span className="block mt-1 text-blue-400">
                 in Navi Mumbai
              </span>
            </h1>

            <p className="text-lg text-slate-300 mb-10 max-w-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Explore hand-picked, RERA-verified properties across Navi Mumbai. Zero brokerage on new launch projects.
            </p>

            {/* Advanced Search Bar */}
            <div className="mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <HeroSearchClient />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <Link href="/properties" className="btn btn-primary px-8 py-3.5 text-base w-full sm:w-auto">
                Browse Verified Properties
              </Link>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn border-white/40 text-white hover:bg-white/10 px-8 py-3.5 text-base w-full sm:w-auto border-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.057 23.927l6.236-1.637A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.369l-.359-.214-3.717.976.993-3.624-.234-.372A9.818 9.818 0 0112 2.182c5.421 0 9.818 4.397 9.818 9.818S17.421 21.818 12 21.818z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <div className="bg-slate-900 border-t border-slate-800 py-4 relative z-20 shadow-lg hidden md:block">
        <div className="container-main flex flex-wrap items-center justify-between gap-4 text-sm font-medium text-slate-300">
          <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> 100% RERA Verified</div>
          <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> Best Price Guaranteed</div>
          <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> Dedicated Local Experts</div>
        </div>
      </div>

      {/* ── Featured Properties ── */}
      <section className="section-pad bg-slate-50">
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-sm font-bold tracking-wider text-blue-600 mb-2 uppercase">
                Premium Selection
              </p>
              <h2 className="section-heading text-slate-900">Featured Projects</h2>
              <p className="section-subheading text-slate-600 max-w-2xl">Explore our top picks across the Mumbai region. Only high-quality, verified developments from trusted builders.</p>
            </div>
            <Link
              href="/properties?featured=true"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:gap-2 transition-all"
            >
              View all projects <ChevronRight size={16} />
            </Link>
          </div>

          <div className="property-grid">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link href="/properties" className="btn btn-outline w-full py-3">
              View All Projects <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="section-pad bg-white">
        <div className="container-main">
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-wider text-blue-600 mb-2 uppercase">Why choose PropConnect?</p>
            <h2 className="section-heading text-slate-900">Your Trusted Property Partner</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_US.map((item) => (
              <div key={item.title} className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"
                  style={{ background: "var(--color-brand-50)" }}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-3 text-lg">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Category & Locality ── */}
      <section className="section-pad bg-slate-50 border-y border-slate-200">
        <div className="container-main grid lg:grid-cols-12 gap-12">
          
          {/* Categories */}
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 gap-4">
              {dynamicCategories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="bg-white p-5 rounded-xl border border-slate-200 text-center hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <div className="font-bold text-sm text-slate-800 group-hover:text-blue-700 mb-1">
                    {cat.label}
                  </div>
                  <div className="text-xs text-slate-500">{cat.count} listings</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Localities */}
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Popular Navi Mumbai Localities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LOCALITIES_SHOWCASE.map(({ key, desc, priceRange }) => (
                <Link
                  key={key}
                  href={`/localities/${key.toLowerCase().replace("_", "-")}`}
                  className="bg-white p-5 rounded-xl border border-slate-200 flex items-start gap-4 hover:border-blue-300 hover:shadow-md group transition-all"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-blue-50">
                    <MapPin size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">
                      {LOCALITY_LABELS[key]}
                    </div>
                    <div className="text-xs text-slate-500 mb-2 leading-relaxed">{desc}</div>
                    <div className="text-xs font-bold text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded-md">{priceRange}</div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 mt-1 shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Testimonials & Closed Deals ── */}
      <section className="section-pad bg-white">
          {/* Testimonials */}
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-bold tracking-wider text-blue-600 mb-2 uppercase text-center">Success Stories</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">What our buyers say</h2>
            <div className="space-y-6">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={16} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-slate-700 italic mb-4">&quot;{t.content}&quot;</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{t.name}</span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-12 lg:py-24 px-4 sm:px-6">
        <div className="container-main relative rounded-[2rem] overflow-hidden py-20 lg:py-28 shadow-2xl">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80" 
              alt="Dream property background" 
              fill 
              className="object-cover object-center" 
            />
          </div>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-slate-900/75 sm:bg-slate-900/60" />
          
          <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-sm">
              Ready to find your dream property?
            </h2>
            <p className="text-lg text-slate-100 mb-10 font-medium drop-shadow-sm">
              Our experts are available on WhatsApp to curate the best properties tailored to your needs. Zero brokerage on new launch projects.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-white text-blue-700 hover:bg-slate-50 px-10 py-4 text-base shadow-xl font-bold transition-transform hover:scale-105"
              >
                💬 Chat on WhatsApp
              </a>
              <Link href="/contact" className="btn border-white text-white hover:bg-white/20 px-10 py-4 text-base border-2 font-bold backdrop-blur-sm transition-transform hover:scale-105">
                Request a Callback
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <StickyContactBar />
    </>
  );
}
