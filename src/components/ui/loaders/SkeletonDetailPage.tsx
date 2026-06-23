export function SkeletonDetailPage() {
  return (
    <div className="bg-[var(--color-surface-2)] pb-24 lg:pb-0 min-h-screen">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b border-[var(--color-border)] h-12 flex items-center">
        <div className="container-main">
          <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="container-main py-6">
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Left: Main Content */}
          <div className="flex-1 min-w-0">
            {/* Image Gallery Skeleton */}
            <div className="card overflow-hidden mb-5">
              <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-72 md:h-96">
                <div className="col-span-4 md:col-span-3 row-span-2 bg-slate-200 animate-pulse" />
                <div className="hidden md:block col-span-1 row-span-1 bg-slate-200 animate-pulse" />
                <div className="hidden md:block col-span-1 row-span-1 bg-slate-200 animate-pulse" />
              </div>
            </div>

            {/* Title & Badges Skeleton */}
            <div className="card p-5 mb-5">
              <div className="flex gap-2 mb-3">
                <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
              </div>
              
              <div className="h-8 w-3/4 bg-slate-200 rounded animate-pulse mb-3" />
              <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse mb-6" />

              {/* Key Specs Strip Skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-[var(--color-border)]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={`spec-${i}`} className="flex flex-col items-center gap-2">
                    <div className="h-5 w-16 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-12 bg-slate-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="card p-5 mb-5">
              <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-4/5 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right: Contact Sidebar Skeleton */}
          <div className="lg:w-80 shrink-0">
            <div className="card p-5 sticky top-24">
              <div className="h-10 w-48 bg-slate-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-slate-100 rounded animate-pulse mb-6" />
              
              <div className="divider my-4" />
              
              <div className="h-12 w-full bg-slate-200 rounded animate-pulse mb-3" />
              <div className="h-12 w-full bg-slate-200 rounded animate-pulse mb-6" />
              
              <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-4" />
                <div className="h-10 w-full bg-slate-100 rounded animate-pulse" />
                <div className="h-10 w-full bg-slate-100 rounded animate-pulse" />
                <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
