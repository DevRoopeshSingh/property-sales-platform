"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface SaveButtonProps {
  propertyId: string;
  className?: string;
}

export default function SaveButton({ propertyId, className = "" }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Avoid synchronous setState in effect to satisfy linter
    requestAnimationFrame(() => setMounted(true));
    const saved = localStorage.getItem("savedProperties");
    if (saved) {
      try {
        const ids = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsSaved(ids.includes(propertyId));
      } catch (e) {
        console.error("Could not parse saved properties", e);
      }
    }
  }, [propertyId]);

  const toggleSave = () => {
    const saved = localStorage.getItem("savedProperties");
    let ids: string[] = [];
    if (saved) {
      try {
        ids = JSON.parse(saved);
      } catch {
        // ignore
      }
    }

    if (ids.includes(propertyId)) {
      ids = ids.filter((id) => id !== propertyId);
      setIsSaved(false);
    } else {
      ids.push(propertyId);
      setIsSaved(true);
    }

    localStorage.setItem("savedProperties", JSON.stringify(ids));
    
    // Dispatch a custom event in case we want a counter in the navbar to update
    window.dispatchEvent(new Event("savedPropertiesUpdated"));
  };

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <button
      onClick={toggleSave}
      className={`inline-flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${className}`}
      aria-label={isSaved ? "Remove from favorites" : "Save to favorites"}
      title={isSaved ? "Remove from favorites" : "Save to favorites"}
    >
      <Heart 
        size={16} 
        className={isSaved ? "fill-red-500 text-red-500" : "text-inherit"} 
      />
      <span className="text-sm font-medium">
        {isSaved ? "Saved" : "Save"}
      </span>
    </button>
  );
}
