export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-slate-50 transition-colors">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={`skeleton-td-${i}`} className="p-4 whitespace-nowrap">
          {i === 0 ? (
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
            </div>
          ) : (
            <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
          )}
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full">
      <div className="rounded-xl border border-[var(--color-border)] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--color-text-secondary)]">
            <thead className="bg-[var(--color-surface-2)] text-[var(--color-text-primary)] text-xs uppercase font-bold tracking-wider">
              <tr>
                {Array.from({ length: columns }).map((_, i) => (
                  <th key={`skeleton-th-${i}`} className="p-4">
                    <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {Array.from({ length: rows }).map((_, i) => (
                <SkeletonTableRow key={`skeleton-row-${i}`} columns={columns} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
