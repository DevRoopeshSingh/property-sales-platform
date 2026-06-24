"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const PROPERTY_TYPES = ["RESIDENTIAL", "COMMERCIAL"];
const LOCALITIES = [
  "MUMBAI",
  "NAVI_MUMBAI",
  "THANE",
  "MIRA_ROAD",
  "BHAYANDAR",
  "NAIGAON",
  "VASAI",
  "NALASOPARA",
  "VIRAR"
];

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentType = searchParams.get("type") || "";
  const currentLocality = searchParams.get("locality") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-sm">
      <div className="flex-1">
        <label htmlFor="type" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
          Property Type
        </label>
        <select
          id="type"
          value={currentType}
          onChange={(e) => {
            router.push("?" + createQueryString("type", e.target.value));
          }}
          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)] text-[var(--color-text-primary)] transition-colors"
        >
          <option value="">All Types</option>
          {PROPERTY_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor="locality" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
          Location
        </label>
        <select
          id="locality"
          value={currentLocality}
          onChange={(e) => {
            router.push("?" + createQueryString("locality", e.target.value));
          }}
          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)] text-[var(--color-text-primary)] transition-colors"
        >
          <option value="">All Locations</option>
          {LOCALITIES.map(loc => (
            <option key={loc} value={loc}>{loc.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
