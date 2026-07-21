"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2, X } from "lucide-react";
import { createPortal } from "react-dom";

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
  
  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocalitySlug, setSelectedLocalitySlug] = useState("");
  const [subType, setSubType] = useState("");
  
  // Autocomplete UI states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateDropdownPosition = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + 8}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      });
    }
  };

  // Close dropdown when clicking outside & handle position updates
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        // We also need to check if they clicked inside the portal dropdown.
        // Easiest is to add a data attribute to the dropdown and check it.
        const target = event.target as HTMLElement;
        if (!target.closest('[data-search-dropdown="true"]')) {
          setIsDropdownOpen(false);
        }
      }
    }

    if (isDropdownOpen) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition, true);
      window.addEventListener("resize", updateDropdownPosition);
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition, true);
      window.removeEventListener("resize", updateDropdownPosition);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (selectedLocalitySlug) params.set("locality", selectedLocalitySlug);
    // Fallback: if they typed something but didn't select, try to match it
    else if (searchTerm) {
      const match = locations.find(l => l.name.toLowerCase() === searchTerm.toLowerCase());
      if (match) params.set("locality", match.slug);
      else params.set("locality", searchTerm.toLowerCase().replace(/[^a-z0-9]+/g, "-")); // Best effort
    }
    if (subType) params.set("subType", subType);
    router.push(`/properties?${params.toString()}`);
  };

  const handleSelectLocation = (loc: { id: string, name: string, slug: string }) => {
    setSearchTerm(loc.name);
    setSelectedLocalitySlug(loc.slug);
    setIsDropdownOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") setIsDropdownOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => prev < filteredLocations.length - 1 ? prev + 1 : prev);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredLocations.length) {
        handleSelectLocation(filteredLocations[activeIndex]);
      } else if (searchTerm) {
        setIsDropdownOpen(false);
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  const renderDropdown = () => {
    if (!isDropdownOpen) return null;

    const content = (
      <div 
        data-search-dropdown="true"
        className="bg-white rounded-xl shadow-xl shadow-slate-900/10 border border-slate-200 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2"
        style={dropdownStyle}
      >
        {filteredLocations.length > 0 ? (
          <ul className="py-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {filteredLocations.map((loc, index) => (
              <li key={loc.id}>
                <button
                  type="button"
                  onClick={() => handleSelectLocation(loc)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                    index === activeIndex 
                      ? "bg-blue-50 text-[var(--color-brand-700)]" 
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <MapPin size={16} className={index === activeIndex ? "text-[var(--color-brand-600)]" : "text-slate-400"} />
                  <span className="font-medium truncate">{loc.name}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : searchTerm ? (
          <div className="p-4 text-center">
            <p className="text-sm text-slate-500">No locations found matching "{searchTerm}"</p>
          </div>
        ) : null}
      </div>
    );

    return mounted && typeof document !== 'undefined' ? createPortal(content, document.body) : null;
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="bg-white/10 backdrop-blur-md border border-white/20 p-2 md:p-3 rounded-2xl grid grid-cols-1 md:grid-cols-[1.5fr_1fr_auto] gap-2 md:gap-3 w-full shadow-2xl relative z-30"
    >
      {/* Autocomplete Input */}
      <div 
        ref={wrapperRef}
        className="relative flex items-center bg-white rounded-xl overflow-visible group ring-1 ring-transparent focus-within:ring-[var(--color-brand-500)] focus-within:shadow-md transition-all w-full h-[48px]"
      >
        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-brand-600)] transition-colors pointer-events-none z-10" />
        
        <input
          type="text"
          placeholder="Search locations (e.g. Kharghar)"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedLocalitySlug("");
            setIsDropdownOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-transparent pl-11 pr-10 text-slate-700 font-medium text-sm md:text-base focus:outline-none z-10 placeholder:text-slate-400"
          autoComplete="off"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedLocalitySlug("");
              setIsDropdownOpen(true);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors z-20"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {renderDropdown()}

      {/* Property Type Select */}
      <div className="relative flex items-center bg-white rounded-xl overflow-hidden group ring-1 ring-transparent focus-within:ring-[var(--color-brand-500)] focus-within:shadow-md transition-all w-full h-[48px]">
        <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-brand-600)] transition-colors pointer-events-none z-10" />
        <select 
          value={subType}
          onChange={(e) => setSubType(e.target.value)}
          className="w-full h-full bg-transparent pl-11 pr-10 text-slate-700 font-medium text-sm md:text-base focus:outline-none appearance-none cursor-pointer z-10"
        >
          <option value="">Property Type</option>
          {PROPERTY_SUB_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>

      {/* Search Button */}
      <button 
        type="submit"
        className="bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-700)] text-white font-bold px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md w-full h-[48px]"
      >
        <Search size={18} />
        <span>Search</span>
      </button>
    </form>
  );
}
