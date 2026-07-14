"use client";

import { Phone } from "lucide-react";
import { generateWhatsAppLink, generateCallLink } from "@/lib/whatsapp";
import { useSettings } from "@/contexts/SettingsContext";
import CallbackModal from "./CallbackModal";

import { LOCALITY_LABELS, type PropertyDetail } from "@/types";

interface StickyContactBarProps {
  property?: Partial<PropertyDetail>;
}

export default function StickyContactBar({ property }: StickyContactBarProps) {
  const settings = useSettings();
  
  // Calculate URL on client side
  const url = typeof window !== "undefined" && property ? `${window.location.origin}/properties/${property.slug}` : "";
  
  const waLink = generateWhatsAppLink({
    propertyTitle: property?.title,
    propertyId: property?.id,
    source: "sticky-bar",
    settings,
    builderName: property?.builderName,
    locality: property?.locality ? (LOCALITY_LABELS[property.locality as keyof typeof LOCALITY_LABELS] ?? property.locality) : undefined,
    bhk: property?.bhk,
    area: property?.area,
    priceLabel: property?.priceLabel,
    url: url,
  });
  const callLink = generateCallLink(settings?.supportPhone);

  return (
    <div className="sticky-wa-bar lg:hidden pb-[env(safe-area-inset-bottom)]" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <a
        href={callLink}
        className="btn btn-outline flex-1 text-xs sm:text-sm py-2.5 bg-white shadow-sm"
        id="sticky-call-btn"
        aria-label="Call us"
      >
        <Phone size={15} />
        Call
      </a>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-whatsapp flex-1 text-xs sm:text-sm py-2.5 shadow-[0_4px_14px_rgba(37,211,102,0.3)]"
        id="sticky-whatsapp-btn"
        aria-label="Chat on WhatsApp"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.057 23.927l6.236-1.637A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.369l-.359-.214-3.717.976.993-3.624-.234-.372A9.818 9.818 0 0112 2.182c5.421 0 9.818 4.397 9.818 9.818S17.421 21.818 12 21.818z" />
        </svg>
        WhatsApp
      </a>
      <CallbackModal 
        propertyTitle={property?.title}
        triggerButtonText="Callback"
        triggerButtonClass="btn btn-primary flex-1 text-xs sm:text-sm py-2.5 shadow-[0_4px_14px_rgba(26,111,232,0.3)]"
      />
    </div>
  );
}
