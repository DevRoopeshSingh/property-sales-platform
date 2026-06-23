import type { Metadata } from "next";
import Link from "next/link";
import { SlidersHorizontal, X, Search } from "lucide-react";
import PropertyCard from "@/components/public/PropertyCard";
import StickyContactBar from "@/components/public/StickyContactBar";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import {
  LOCALITY_LABELS,
  PROPERTY_SUB_TYPE_LABELS,
  POSSESSION_LABELS,
  type Locality,
  type PropertySubType,
  type Possession,
} from "@/types";

export const metadata: Metadata = {
  title: "Browse Properties — Mumbai Metropolitan Region",
  description:
    "Search and filter properties across Mumbai, Navi Mumbai, Thane, Vasai-Virar. Filter by BHK, budget, property type, and locality. Apartments, Villas, Plots & Commercial spaces.",
};

// Placeholder data (will be replaced with DB query via Server Actions)
const DEMO_PROPERTIES = Array.from({ length: 12 }, (_, i) => ({
  id: `demo-${i}`,
  title: [
    "Spacious 2BHK Apartment in Virar West",
    "Premium 3BHK Villa in Thane",
    "Affordable 1BHK in Nalasopara East",
    "Commercial Office Space in Navi Mumbai",
    "Ready to Move 2BHK in Vasai",
    "New Launch Row House in Mira Road",
    "3BHK Independent House in Bhayandar",
    "Studio Apartment in Mumbai Andheri",
    "2BHK Flat near Naigaon Station",
    "Shop Space in Virar Market",
    "Luxury 4BHK Villa in Thane West",
    "Plot in Vasai East",
  ][i],
  slug: `property-${i + 1}`,
  type: (i < 9 ? "RESIDENTIAL" : "COMMERCIAL") as "RESIDENTIAL" | "COMMERCIAL",
  subType: (["APARTMENT", "VILLA", "APARTMENT", "OFFICE", "APARTMENT", "ROW_HOUSE", "INDEPENDENT_HOUSE", "APARTMENT", "APARTMENT", "SHOP", "VILLA", "PLOT"] as PropertySubType[])[i],
  status: "ACTIVE" as const,
  featured: i < 3,
  price: [4500000, 12000000, 2800000, 8000000, 5500000, 7500000, 9500000, 6500000, 3200000, 4000000, 18000000, 1500000][i],
  priceLabel: ["₹45 L", "₹1.2 Cr", "₹28 L", "₹80 L", "₹55 L", "₹75 L", "₹95 L", "₹65 L", "₹32 L", "₹40 L", "₹1.8 Cr", "₹15 L"][i],
  bhk: [2, 3, 1, null, 2, null, 3, 1, 2, null, 4, null][i],
  area: [850, 1800, 500, 1200, 950, 1400, 1600, 600, 750, 800, 2500, 1000][i],
  floor: [5, null, 3, 2, 8, null, null, 10, 4, 1, null, null][i],
  locality: (["VIRAR", "THANE", "NALASOPARA", "NAVI_MUMBAI", "VASAI", "MIRA_ROAD", "BHAYANDAR", "MUMBAI", "NAIGAON", "VIRAR", "THANE", "VASAI"] as Locality[])[i],
  address: "Sample Address",
  possession: (["READY_TO_MOVE", "UNDER_CONSTRUCTION", "READY_TO_MOVE", "READY_TO_MOVE", "READY_TO_MOVE", "NEW_LAUNCH", "READY_TO_MOVE", "UNDER_CONSTRUCTION", "READY_TO_MOVE", "READY_TO_MOVE", "UNDER_CONSTRUCTION", "READY_TO_MOVE"] as Possession[])[i],
  images: [],
  createdAt: new Date(),
}));

const LOCALITIES_FILTER = Object.entries(LOCALITY_LABELS) as [Locality, string][];
const SUB_TYPES_FILTER = Object.entries(PROPERTY_SUB_TYPE_LABELS) as [PropertySubType, string][];
const BHK_OPTIONS = [1, 2, 3, 4];
const POSSESSION_FILTER = Object.entries(POSSESSION_LABELS) as [Possession, string][];

export default function PropertiesPage() {
  return (
    <>
      <div className="bg-[var(--color-surface-2)] min-h-screen">
        {/* Page Header */}
        <div className="bg-white border-b border-[var(--color-border)]">
          <div className="container-main py-6">
            <nav className="text-sm text-[var(--color-text-muted)] mb-2">
              <Link href="/" className="hover:text-[var(--color-brand-600)]">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-[var(--color-text-primary)] font-medium">Properties</span>
            </nav>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
                  Properties in Mumbai Region
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Showing <strong>{DEMO_PROPERTIES.length}</strong> properties
                </p>
              </div>
              {/* Sort */}
              <select className="input w-auto text-sm py-2 px-3 cursor-pointer">
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="featured">Featured First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="container-main py-6">
          <div className="flex gap-6">
            {/* ── Filters Sidebar (desktop) ── */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="card p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                    <SlidersHorizontal size={16} />
                    Filters
                  </h2>
                  <button className="text-xs text-[var(--color-brand-600)] font-semibold hover:underline">
                    Clear all
                  </button>
                </div>

                {/* Locality */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                    Locality
                  </h3>
                  <div className="space-y-2">
                    {LOCALITIES_FILTER.map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          id={`locality-${key}`}
                          className="w-4 h-4 rounded accent-[var(--color-brand-600)] cursor-pointer"
                        />
                        <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="divider" />

                {/* Property Type */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                    Property Type
                  </h3>
                  <div className="space-y-2">
                    {SUB_TYPES_FILTER.map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          id={`subtype-${key}`}
                          className="w-4 h-4 rounded accent-[var(--color-brand-600)] cursor-pointer"
                        />
                        <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="divider" />

                {/* BHK */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                    BHK
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {BHK_OPTIONS.map((bhk) => (
                      <button
                        key={bhk}
                        className="px-3 py-1.5 text-sm font-medium rounded-lg border border-[var(--color-border)] hover:border-[var(--color-brand-400)] hover:bg-[var(--color-brand-50)] hover:text-[var(--color-brand-700)] transition-colors"
                      >
                        {bhk} BHK
                      </button>
                    ))}
                    <button className="px-3 py-1.5 text-sm font-medium rounded-lg border border-[var(--color-border)] hover:border-[var(--color-brand-400)] hover:bg-[var(--color-brand-50)] hover:text-[var(--color-brand-700)] transition-colors">
                      4+ BHK
                    </button>
                  </div>
                </div>

                <div className="divider" />

                {/* Budget */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                    Budget
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Min (₹ Lakhs)</label>
                      <input type="number" placeholder="0" className="input text-sm py-2" />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Max (₹ Lakhs)</label>
                      <input type="number" placeholder="500" className="input text-sm py-2" />
                    </div>
                  </div>
                </div>

                <div className="divider" />

                {/* Possession */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                    Possession
                  </h3>
                  <div className="space-y-2">
                    {POSSESSION_FILTER.map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          id={`possession-${key}`}
                          className="w-4 h-4 rounded accent-[var(--color-brand-600)] cursor-pointer"
                        />
                        <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="btn btn-primary w-full">
                  <Search size={15} />
                  Apply Filters
                </button>
              </div>
            </aside>

            {/* ── Results Grid ── */}
            <div className="flex-1 min-w-0">
              {/* Mobile filter bar */}
              <div className="lg:hidden flex gap-3 mb-4 overflow-x-auto pb-2">
                <button className="btn btn-outline text-sm py-2 whitespace-nowrap">
                  <SlidersHorizontal size={14} /> All Filters
                </button>
                {["Mumbai", "2 BHK", "Ready to Move"].map((tag) => (
                  <button
                    key={tag}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--color-brand-300)] bg-[var(--color-brand-50)] text-sm text-[var(--color-brand-700)] font-medium whitespace-nowrap"
                  >
                    {tag} <X size={12} />
                  </button>
                ))}
              </div>

              {DEMO_PROPERTIES.length > 0 ? (
                <>
                  <div className="property-grid">
                    {DEMO_PROPERTIES.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-center gap-2 mt-8 pb-8">
                    <button className="btn btn-ghost text-sm px-4 py-2" disabled>← Previous</button>
                    {[1, 2, 3].map((page) => (
                      <button
                        key={page}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                          page === 1
                            ? "bg-[var(--color-brand-600)] text-white"
                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-3)]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button className="btn btn-ghost text-sm px-4 py-2">Next →</button>
                  </div>
                </>
              ) : (
                /* Empty State */
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🏠</div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No properties found</h3>
                  <p className="text-[var(--color-text-secondary)] mb-6">
                    Try adjusting your filters or chat with us — we might have unlisted properties!
                  </p>
                  <a
                    href={generateWhatsAppLink({ source: "listing-empty-state" })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                  >
                    💬 Ask on WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <StickyContactBar />
    </>
  );
}
