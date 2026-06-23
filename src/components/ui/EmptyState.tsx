import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="p-12 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-[var(--color-surface-2)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-text-muted)]">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{title}</h3>
      <p className="text-[var(--color-text-secondary)] mt-2 mb-6 max-w-sm mx-auto text-balance">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
