"use client";

import { useEffect, useState } from "react";
import { getPropertiesByIds } from "@/app/actions/property";
import PropertyCard from "@/components/public/PropertyCard";
import { Loader2, HeartCrack } from "lucide-react";
import type { PropertyCardData } from "@/types";
import Link from "next/link";

export default function SavedPropertiesClient() {
  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const saved = localStorage.getItem("savedProperties");
        if (saved) {
          const ids = JSON.parse(saved) as string[];
          if (ids.length > 0) {
            const data = await getPropertiesByIds(ids);
            // We need to type cast because our action returns slightly different types than the strict PropertyCardData 
            // but it's compatible enough for the card component.
            setProperties(data as unknown as PropertyCardData[]);
          }
        }
      } catch (err) {
        console.error("Error fetching saved properties", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaved();

    // Listen for custom event if the user un-saves a property from another tab (optional but good practice)
    const handleUpdate = () => {
      fetchSaved();
    };
    
    window.addEventListener("savedPropertiesUpdated", handleUpdate);
    return () => window.removeEventListener("savedPropertiesUpdated", handleUpdate);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
        <Loader2 size={40} className="animate-spin text-[var(--color-brand-500)] mb-4" />
        <p className="text-[var(--color-text-secondary)]">Loading your saved properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[50vh] text-center">
        <p className="text-red-500 mb-2">Something went wrong while loading your favorites.</p>
        <button onClick={() => window.location.reload()} className="btn btn-outline">Try Again</button>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 min-h-[50vh] text-center px-4">
        <HeartCrack size={60} className="text-[var(--color-border)] mb-4" />
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">No Saved Properties</h2>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-md">
          You haven&apos;t saved any properties yet. Click the heart icon on any property to save it here for later.
        </p>
        <Link href="/properties" className="btn btn-primary">
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] mb-2">
            Saved Properties
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            You have {properties.length} {properties.length === 1 ? 'property' : 'properties'} saved.
          </p>
        </div>
      </div>

      <div className="property-grid">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
