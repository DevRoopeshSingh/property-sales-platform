import type { Metadata } from "next";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import PropertyCard from "@/components/public/PropertyCard";
import StickyContactBar from "@/components/public/StickyContactBar";
import SortSelect from "@/components/public/SortSelect";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { prisma } from "@/lib/prisma";
import {
  LOCALITY_LABELS,
  PROPERTY_SUB_TYPE_LABELS,
  POSSESSION_LABELS,
  type Locality,
  type PropertySubType,
  type Possession,
} from "@/types";
import { Prisma } from "@prisma/client";
import { PropertyCardData } from "@/types";

export const metadata: Metadata = {
  title: "Browse Properties — All over India | PropConnect",
  description:
    "Search and filter properties across India. Filter by BHK, budget, property type, and city. Apartments, Villas, Plots & Commercial spaces.",
};

const LOCALITIES_FILTER = Object.entries(LOCALITY_LABELS) as [Locality, string][];
const SUB_TYPES_FILTER = Object.entries(PROPERTY_SUB_TYPE_LABELS) as [PropertySubType, string][];
const BHK_OPTIONS = [1, 2, 3, 4];
const POSSESSION_FILTER = Object.entries(POSSESSION_LABELS) as [Possession, string][];

interface SearchParams {
  locality?: string | string[];
  subType?: string | string[];
  bhk?: string | string[];
  possession?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

function toArray(val?: string | string[]): string[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const localities = toArray(params.locality);
  const subTypes = toArray(params.subType);
  const bhks = toArray(params.bhk).map(Number).filter(Boolean);
  const possessions = toArray(params.possession);
  const minPrice = params.minPrice ? Number(params.minPrice) * 100000 : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) * 100000 : undefined;
  const sort = params.sort ?? "newest";

  const where: Prisma.PropertyWhereInput = {
    status: "ACTIVE",
    ...(localities.length > 0 && { locality: { in: localities as Locality[] } }),
    ...(subTypes.length > 0 && { subType: { in: subTypes as PropertySubType[] } }),
    ...(bhks.length > 0 && { bhk: { in: bhks } }),
    ...(possessions.length > 0 && { possession: { in: possessions as Possession[] } }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
  };

  const orderBy: Prisma.PropertyOrderByWithRelationInput =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
      ? { price: "desc" }
      : sort === "featured"
      ? { featured: "desc" }
      : { createdAt: "desc" };

  const rawProperties = await prisma.property.findMany({
    where,
    orderBy,
    include: { images: true },
    take: 24,
  });

  const properties = rawProperties.map((p) => ({
    ...p,
    price: Number(p.price),
  })) as unknown as PropertyCardData[];

  const waLink = generateWhatsAppLink({ source: "listing-empty-state" });

  // Helper to build filter URL
  function buildUrl(key: string, value: string, toggle = true): string {
    const sp = new URLSearchParams();
    // Carry over all existing params
    if (localities.length > 0) localities.forEach((v) => sp.append("locality", v));
    if (subTypes.length > 0) subTypes.forEach((v) => sp.append("subType", v));
    if (bhks.length > 0) bhks.forEach((v) => sp.append("bhk", String(v)));
    if (possessions.length > 0) possessions.forEach((v) => sp.append("possession", v));
    if (params.minPrice) sp.set("minPrice", params.minPrice);
    if (params.maxPrice) sp.set("maxPrice", params.maxPrice);
    if (sort !== "newest") sp.set("sort", sort);

    if (toggle) {
      const current = sp.getAll(key);
      sp.delete(key);
      if (current.includes(value)) {
        current.filter((v) => v !== value).forEach((v) => sp.append(key, v));
      } else {
        [...current, value].forEach((v) => sp.append(key, v));
      }
    } else {
      sp.set(key, value);
    }
    return `/properties?${sp.toString()}`;
  }

  const activeFilterCount =
    localities.length + subTypes.length + bhks.length + possessions.length +
    (minPrice !== undefined ? 1 : 0) + (maxPrice !== undefined ? 1 : 0);

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
                  Properties in India
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Showing <strong>{properties.length}</strong> properties
                  {activeFilterCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] text-xs font-medium">
                      {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                    </span>
                  )}
                </p>
              </div>
              {/* Sort */}
              <SortSelect currentSort={sort} />
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
                  {activeFilterCount > 0 && (
                    <Link href="/properties" className="text-xs text-[var(--color-brand-600)] font-semibold hover:underline">
                      Clear all
                    </Link>
                  )}
                </div>

                {/* Locality */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                    Locality
                  </h3>
                  <div className="space-y-2">
                    {LOCALITIES_FILTER.map(([key, label]) => (
                      <Link
                        key={key}
                        href={buildUrl("locality", key)}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            localities.includes(key)
                              ? "bg-[var(--color-brand-600)] border-[var(--color-brand-600)]"
                              : "border-[var(--color-border)] group-hover:border-[var(--color-brand-400)]"
                          }`}
                        >
                          {localities.includes(key) && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className={`text-sm transition-colors ${localities.includes(key) ? "text-[var(--color-brand-700)] font-medium" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"}`}>
                          {label}
                        </span>
                      </Link>
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
                      <Link
                        key={key}
                        href={buildUrl("subType", key)}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            subTypes.includes(key)
                              ? "bg-[var(--color-brand-600)] border-[var(--color-brand-600)]"
                              : "border-[var(--color-border)] group-hover:border-[var(--color-brand-400)]"
                          }`}
                        >
                          {subTypes.includes(key) && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className={`text-sm transition-colors ${subTypes.includes(key) ? "text-[var(--color-brand-700)] font-medium" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"}`}>
                          {label}
                        </span>
                      </Link>
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
                    {[...BHK_OPTIONS, "4+"].map((bhk) => {
                      const val = String(bhk);
                      const active = bhks.includes(Number(bhk));
                      return (
                        <Link
                          key={val}
                          href={buildUrl("bhk", val)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                            active
                              ? "bg-[var(--color-brand-600)] text-white border-[var(--color-brand-600)]"
                              : "border-[var(--color-border)] hover:border-[var(--color-brand-400)] hover:bg-[var(--color-brand-50)] hover:text-[var(--color-brand-700)]"
                          }`}
                        >
                          {val} BHK
                        </Link>
                      );
                    })}
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
                      <Link
                        key={key}
                        href={buildUrl("possession", key)}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            possessions.includes(key)
                              ? "bg-[var(--color-brand-600)] border-[var(--color-brand-600)]"
                              : "border-[var(--color-border)] group-hover:border-[var(--color-brand-400)]"
                          }`}
                        >
                          {possessions.includes(key) && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className={`text-sm transition-colors ${possessions.includes(key) ? "text-[var(--color-brand-700)] font-medium" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"}`}>
                          {label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* ── Results Grid ── */}
            <div className="flex-1 min-w-0">
              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {localities.map((v) => (
                    <Link key={v} href={buildUrl("locality", v)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-brand-300)] bg-[var(--color-brand-50)] text-sm text-[var(--color-brand-700)] font-medium">
                      {LOCALITY_LABELS[v as Locality]} <X size={12} />
                    </Link>
                  ))}
                  {subTypes.map((v) => (
                    <Link key={v} href={buildUrl("subType", v)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-brand-300)] bg-[var(--color-brand-50)] text-sm text-[var(--color-brand-700)] font-medium">
                      {PROPERTY_SUB_TYPE_LABELS[v as PropertySubType]} <X size={12} />
                    </Link>
                  ))}
                  {bhks.map((v) => (
                    <Link key={v} href={buildUrl("bhk", String(v))} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-brand-300)] bg-[var(--color-brand-50)] text-sm text-[var(--color-brand-700)] font-medium">
                      {v} BHK <X size={12} />
                    </Link>
                  ))}
                  {possessions.map((v) => (
                    <Link key={v} href={buildUrl("possession", v)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-brand-300)] bg-[var(--color-brand-50)] text-sm text-[var(--color-brand-700)] font-medium">
                      {POSSESSION_LABELS[v as Possession]} <X size={12} />
                    </Link>
                  ))}
                </div>
              )}

              {properties.length > 0 ? (
                <div className="property-grid">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🏠</div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No properties found</h3>
                  <p className="text-[var(--color-text-secondary)] mb-6">
                    Try adjusting your filters or chat with us — we might have unlisted properties!
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Link href="/properties" className="btn btn-outline">
                      Clear Filters
                    </Link>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                    >
                      💬 Ask on WhatsApp
                    </a>
                  </div>
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
