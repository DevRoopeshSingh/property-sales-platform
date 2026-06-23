import { cn } from "@/lib/utils";

export function SkeletonPropertyCard({ className }: { className?: string }) {
  return (
    <article className={cn("card border border-[var(--color-border)] overflow-hidden", className)}>
      {/* Image Skeleton */}
      <div className="h-64 bg-slate-200 animate-pulse w-full" />

      {/* Content Skeleton */}
      <div className="p-4 flex flex-col h-full gap-3">
        {/* Top row (Price & Builder) */}
        <div className="flex justify-between items-start mb-1">
          <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-20 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Title */}
        <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse" />
        <div className="h-5 w-1/2 bg-slate-200 rounded animate-pulse mb-1" />

        {/* Location */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100 mt-2">
          <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* CTA */}
        <div className="mt-2 flex justify-between items-center">
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-4 bg-slate-200 rounded-full animate-pulse" />
        </div>
      </div>
    </article>
  );
}

export function SkeletonPropertyGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="property-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonPropertyCard key={`skeleton-card-${i}`} />
      ))}
    </div>
  );
}
