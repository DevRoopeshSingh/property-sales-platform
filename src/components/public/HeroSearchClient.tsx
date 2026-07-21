"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2 } from "lucide-react";

const PROPERTY_SUB_TYPES = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "INDEPENDENT_HOUSE", label: "Independent House" },
  { value: "PLOT", label: "Plot" },
  { value: "OFFICE", label: "Office" },
  { value: "SHOP", label: "Shop" },
];

export default function HeroSearchClient({ locations = [] }: { locations?: { id: string, name: string, slug: string }[] }) {
  const router = useRouter();
  const [locality, setLocality] = useState("");
  const [subType, setSubType] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locality) params.set("locality", locality);
    if (subType) params.set("subType", subType);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="bg-white/10 backdrop-blur-md border border-white/20 p-2 md:p-3 rounded-2xl flex flex-col md:flex-row gap-2 max-w-4xl mx-auto shadow-2xl"
    >
      <div className="flex-1 relative flex items-center bg-white rounded-xl overflow-hidden group focus-within:ring-2 focus-within:ring-[var(--color-brand-500)]">
        <MapPin size={18} className="absolute left-4 text-slate-400 group-focus-within:text-[var(--color-brand-600)] transition-colors" />
        <select 
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          className="w-full bg-transparent py-3.5 pl-11 pr-4 text-slate-700 font-medium focus:outline-none appearance-none cursor-pointer"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.slug}>{loc.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 relative flex items-center bg-white rounded-xl overflow-hidden group focus-within:ring-2 focus-within:ring-[var(--color-brand-500)]">
        <Building2 size={18} className="absolute left-4 text-slate-400 group-focus-within:text-[var(--color-brand-600)] transition-colors" />
        <select 
          value={subType}
          onChange={(e) => setSubType(e.target.value)}
          className="w-full bg-transparent py-3.5 pl-11 pr-4 text-slate-700 font-medium focus:outline-none appearance-none cursor-pointer"
        >
          <option value="">Property Type</option>
          {PROPERTY_SUB_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <button 
        type="submit"
        className="bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-700)] text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shrink-0"
      >
        <Search size={18} />
        <span>Search</span>
      </button>
    </form>
  );
}
