import type { Metadata } from "next";
import Link from "next/link";
import { Search, MapPin, TrendingUp, Shield, Star, ChevronRight, Building2 } from "lucide-react";
import PropertyCard from "@/components/public/PropertyCard";
import StickyContactBar from "@/components/public/StickyContactBar";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { LOCALITY_LABELS, type Locality } from "@/types";

export const metadata: Metadata = {
  title: "PropConnect — Find Your Dream Property in Mumbai",
  description:
    "Discover premium residential and commercial properties across Mumbai, Navi Mumbai, Thane, Vasai-Virar. Connect instantly on WhatsApp. Apartments, Villas, Plots, Offices and more.",
  keywords: "property in mumbai, flats in virar, 2bhk vasai, apartments thane, buy property mumbai",
};

const CATEGORIES = [
  { label: "Apartments", icon: "🏢", href: "/properties?subType=APARTMENT", count: "200+" },
  { label: "Villas", icon: "🏡", href: "/properties?subType=VILLA", count: "50+" },
  { label: "Independent Houses", icon: "🏠", href: "/properties?subType=INDEPENDENT_HOUSE", count: "30+" },
  { label: "Row Houses", icon: "🏘️", href: "/properties?subType=ROW_HOUSE", count: "20+" },
  { label: "Plots", icon: "🗺️", href: "/properties?subType=PLOT", count: "40+" },
  { label: "Offices", icon: "🏛️", href: "/properties?subType=OFFICE", count: "60+" },
  { label: "Shops", icon: "🏪", href: "/properties?subType=SHOP", count: "45+" },
  { label: "Showrooms", icon: "🏬", href: "/properties?subType=SHOWROOM", count: "15+" },
];

const LOCALITIES_SHOWCASE: { key: Locality; desc: string; priceRange: string }[] = [
  { key: "VIRAR", desc: "Peaceful suburbs with excellent connectivity", priceRange: "₹25L–₹80L" },
  { key: "VASAI", desc: "Affordable living with great infrastructure", priceRange: "₹30L–₹1.2Cr" },
  { key: "NALASOPARA", desc: "Fast-growing locality with new developments", priceRange: "₹20L–₹75L" },
  { key: "THANE", desc: "Prime urban destination with top amenities", priceRange: "₹60L–₹3Cr" },
  { key: "NAVI_MUMBAI", desc: "Planned city with modern infrastructure", priceRange: "₹55L–₹2.5Cr" },
  { key: "MIRA_ROAD", desc: "Emerging hotspot with great value", priceRange: "₹40L–₹1.5Cr" },
];

const TRUST_STATS = [
  { value: "500+", label: "Properties Listed" },
  { value: "1,200+", label: "Happy Families" },
  { value: "9", label: "Localities Covered" },
  { value: "5★", label: "Average Rating" },
];

const WHY_US = [
  {
    icon: <Shield size={24} className="text-[var(--color-brand-600)]" />,
    title: "Verified Listings Only",
    desc: "Every property is personally verified by our team before listing.",
  },
  {
    icon: <TrendingUp size={24} className="text-[var(--color-brand-600)]" />,
    title: "Best Price Guarantee",
    desc: "We negotiate directly with builders to get you the best deals.",
  },
  {
    icon: <Star size={24} className="text-[var(--color-brand-600)]" />,
    title: "Expert Guidance",
    desc: "Dedicated property consultants available on WhatsApp, every day.",
  },
  {
    icon: <MapPin size={24} className="text-[var(--color-brand-600)]" />,
    title: "Mumbai Specialists",
    desc: "Hyperlocal experts covering 9 localities across the MMR.",
  },
];

// Placeholder properties for UI demo (will be replaced with DB data)
const DEMO_PROPERTIES = Array.from({ length: 6 }, (_, i) => ({
  id: `demo-${i}`,
  title: [
    "Spacious 2BHK Apartment in Virar West",
    "Premium 3BHK Villa in Thane",
    "Affordable 1BHK in Nalasopara East",
    "Commercial Office Space in Navi Mumbai",
    "Ready to Move 2BHK in Vasai",
    "New Launch Row House in Mira Road",
  ][i],
  slug: `property-${i + 1}`,
  type: (i < 5 ? "RESIDENTIAL" : "COMMERCIAL") as "RESIDENTIAL" | "COMMERCIAL",
  subType: (["APARTMENT", "VILLA", "APARTMENT", "OFFICE", "APARTMENT", "ROW_HOUSE"] as const)[i],
  status: "ACTIVE" as const,
  featured: i < 3,
  price: [4500000, 12000000, 2800000, 8000000, 5500000, 7500000][i],
  priceLabel: ["₹45 Lakhs", "₹1.2 Cr", "₹28 Lakhs", "₹80 Lakhs", "₹55 Lakhs", "₹75 Lakhs"][i],
  bhk: [2, 3, 1, null, 2, null][i],
  area: [850, 1800, 500, 1200, 950, 1400][i],
  floor: [5, null, 3, 2, 8, null][i],
  locality: (["VIRAR", "THANE", "NALASOPARA", "NAVI_MUMBAI", "VASAI", "MIRA_ROAD"] as Locality[])[i],
  address: "Sample Address",
  possession: (["READY_TO_MOVE", "UNDER_CONSTRUCTION", "READY_TO_MOVE", "READY_TO_MOVE", "READY_TO_MOVE", "NEW_LAUNCH"] as const)[i],
  images: [],
  createdAt: new Date(),
}));

export default function HomePage() {
  const waLink = generateWhatsAppLink({ source: "homepage-hero" });

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container-main relative py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-up"
              style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Mumbai&apos;s Most Trusted Property Platform
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Find Your Perfect
              <span className="block mt-1" style={{ color: "#93c5fd" }}>
                Home in Mumbai
              </span>
            </h1>

            <p className="text-lg text-white/75 mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Explore 500+ verified properties across Mumbai, Thane, Navi Mumbai, and Vasai-Virar.
              Connect instantly with our experts on WhatsApp.
            </p>

            {/* Search Bar */}
            <div className="glass-card p-3 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-2 flex-1 bg-white rounded-lg px-4 py-2.5">
                <MapPin size={18} className="text-[var(--color-brand-600)] shrink-0" />
                <select className="flex-1 text-sm font-medium text-[var(--color-text-primary)] bg-transparent outline-none cursor-pointer">
                  <option value="">All Localities</option>
                  {Object.entries(LOCALITY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 flex-1 bg-white rounded-lg px-4 py-2.5">
                <Building2 size={18} className="text-[var(--color-brand-600)] shrink-0" />
                <select className="flex-1 text-sm font-medium text-[var(--color-text-primary)] bg-transparent outline-none cursor-pointer">
                  <option value="">All Property Types</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="VILLA">Villa</option>
                  <option value="INDEPENDENT_HOUSE">Independent House</option>
                  <option value="PLOT">Plot</option>
                  <option value="OFFICE">Office</option>
                  <option value="SHOP">Shop</option>
                </select>
              </div>
              <Link
                href="/properties"
                className="btn btn-primary px-6 sm:px-8"
              >
                <Search size={17} />
                Search
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp px-8 py-3 text-base">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.057 23.927l6.236-1.637A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.369l-.359-.214-3.717.976.993-3.624-.234-.372A9.818 9.818 0 0112 2.182c5.421 0 9.818 4.397 9.818 9.818S17.421 21.818 12 21.818z" />
                </svg>
                Chat with an Expert
              </a>
              <Link href="/properties" className="btn btn-outline border-white/40 text-white hover:bg-white/10 px-8 py-3 text-base">
                Browse All Properties
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1200 50 960 60 720 45C480 30 240 10 0 0L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Trust Stats ── */}
      <section className="py-8 bg-white border-b border-[var(--color-border)]">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-[var(--color-brand-700)] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--color-text-secondary)] font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Properties ── */}
      <section className="section-pad bg-[var(--color-surface-2)]">
        <div className="container-main">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm font-semibold text-[var(--color-brand-600)] mb-1">
                ✦ Hand-picked for you
              </p>
              <h2 className="section-heading">Featured Properties</h2>
              <p className="section-subheading">Explore our top picks across the Mumbai region</p>
            </div>
            <Link
              href="/properties?featured=true"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[var(--color-brand-600)] hover:gap-2 transition-all"
            >
              View all <ChevronRight size={16} />
            </Link>
          </div>

          <div className="property-grid">
            {DEMO_PROPERTIES.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/properties" className="btn btn-outline">
              View All Properties <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Browse by Category ── */}
      <section className="section-pad bg-white">
        <div className="container-main">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-[var(--color-brand-600)] mb-1">✦ What are you looking for?</p>
            <h2 className="section-heading">Browse by Category</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="card p-5 text-center hover:border-[var(--color-brand-300)] hover:bg-[var(--color-brand-50)] group"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <div className="font-bold text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-700)] mb-1">
                  {cat.label}
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">{cat.count} listings</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Locality ── */}
      <section className="section-pad bg-[var(--color-surface-2)]">
        <div className="container-main">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-[var(--color-brand-600)] mb-1">✦ Explore neighbourhoods</p>
            <h2 className="section-heading">Browse by Locality</h2>
            <p className="section-subheading">Find properties in your preferred area across the Mumbai region</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LOCALITIES_SHOWCASE.map(({ key, desc, priceRange }) => (
              <Link
                key={key}
                href={`/localities/${key.toLowerCase().replace("_", "-")}`}
                className="card p-5 flex items-start gap-4 hover:border-[var(--color-brand-300)] group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--color-brand-100)" }}
                >
                  <MapPin size={20} className="text-[var(--color-brand-600)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-700)] mb-0.5">
                    {LOCALITY_LABELS[key]}
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] mb-2 leading-relaxed">{desc}</div>
                  <div className="text-xs font-semibold text-[var(--color-brand-600)]">{priceRange}</div>
                </div>
                <ChevronRight size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-600)] mt-1 shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="section-pad bg-white">
        <div className="container-main">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-[var(--color-brand-600)] mb-1">✦ Why choose us?</p>
            <h2 className="section-heading">The PropConnect Advantage</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((item) => (
              <div key={item.title} className="text-center p-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "var(--color-brand-50)" }}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-[var(--color-text-primary)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="hero-gradient py-16">
        <div className="container-main text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-lg text-white/75 mb-8 max-w-xl mx-auto">
            Our experts are available on WhatsApp to help you find the perfect property. No broker fees, direct deals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={generateWhatsAppLink({ source: "homepage-cta-banner" })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp px-10 py-3.5 text-base"
            >
              💬 WhatsApp Us Now
            </a>
            <Link href="/contact" className="btn border-white/40 text-white hover:bg-white/10 px-10 py-3.5 text-base border-2">
              Request a Callback
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <StickyContactBar />
    </>
  );
}
