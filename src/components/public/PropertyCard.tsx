"use client";

import Link from "next/link";
import ImageWithSkeleton from "@/components/ui/loaders/ImageWithSkeleton";
import { MapPin, Maximize2, BedDouble, Building2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { useSettings } from "@/contexts/SettingsContext";
import {
  PropertyCardData,
  LOCALITY_LABELS,
  PROPERTY_SUB_TYPE_LABELS,
} from "@/types";

interface PropertyCardProps {
  property: PropertyCardData;
  className?: string;
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
  const primaryImage = property.images.find((img) => img.isPrimary) ?? property.images[0];
  const settings = useSettings();
  const whatsappLink = generateWhatsAppLink({
    propertyTitle: property.title,
    propertyId: property.id,
    source: "listing-card",
    settings,
  });

  const possessionBadge = {
    READY_TO_MOVE: { text: "Ready to Move", class: "badge-green" },
    UNDER_CONSTRUCTION: { text: "Under Construction", class: "badge-amber" },
    NEW_LAUNCH: { text: "New Launch", class: "badge-blue" },
  }[property.possession];

  return (
    <article className={cn("card group relative", className)}>
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-[var(--color-surface-3)]">
        {primaryImage ? (
          <ImageWithSkeleton
            src={primaryImage.url}
            alt={primaryImage.altText ?? property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 size={40} className="text-[var(--color-border-2)]" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="img-overlay" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {property.isDistressed && (
            <span className="badge bg-red-600 text-white text-[10px] uppercase font-bold tracking-wider shadow-sm border border-red-700">
              Distressed Property
            </span>
          )}
          {property.featured && (
            <span className="badge badge-blue text-xs">⭐ Featured</span>
          )}
          {property.reraNumber && (
            <span className="badge bg-white text-slate-800 text-[10px] uppercase font-bold tracking-wider shadow-sm border border-slate-100">
              ✓ RERA
            </span>
          )}
          <span className={cn("badge text-xs shadow-sm", possessionBadge.class)}>
            {possessionBadge.text}
          </span>
        </div>

        {/* Type badge */}
        <div className="absolute top-3 right-3">
          <span className="badge badge-slate text-xs">
            {PROPERTY_SUB_TYPE_LABELS[property.subType]}
          </span>
        </div>

        {/* WhatsApp hover button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn btn-whatsapp text-xs px-3 py-1.5"
            aria-label="Enquire on WhatsApp"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.057 23.927l6.236-1.637A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.369l-.359-.214-3.717.976.993-3.624-.234-.372A9.818 9.818 0 0112 2.182c5.421 0 9.818 4.397 9.818 9.818S17.421 21.818 12 21.818z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          {/* Price */}
          <div className="price-tag">{property.priceLabel}</div>
          {property.builderName && (
            <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md border border-slate-100 max-w-[100px] truncate" title={property.builderName}>
              By {property.builderName}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-[var(--color-text-primary)] text-[15px] sm:text-base leading-snug mb-2 line-clamp-2 group-hover:text-[var(--color-brand-600)] transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] mb-3">
          <MapPin size={13} className="shrink-0 text-[var(--color-brand-400)]" />
          <span className="truncate">{LOCALITY_LABELS[property.locality]}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] pb-4 border-b border-[var(--color-border)]">
          {property.bhk && (
            <div className="flex items-center gap-1">
              <BedDouble size={14} className="text-[var(--color-brand-400)]" />
              <span>{property.bhk} BHK</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1">
              <Maximize2 size={14} className="text-[var(--color-brand-400)]" />
              <span>{property.area.toLocaleString()} sq ft</span>
            </div>
          )}
          {property.floor && (
            <div className="flex items-center gap-1">
              <Building2 size={14} className="text-[var(--color-brand-400)]" />
              <span>Floor {property.floor}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/properties/${property.slug}`}
          className="flex items-center justify-between mt-3 text-sm font-semibold text-[var(--color-brand-600)] group-hover:gap-3 transition-all"
        >
          <span>View Details</span>
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
