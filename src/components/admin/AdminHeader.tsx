"use client";

import { Menu } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

interface AdminHeaderProps {
  setIsMobileOpen: (val: boolean) => void;
}

export function AdminHeader({ setIsMobileOpen }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:hidden shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 -ml-2 text-slate-600 hover:text-[var(--color-brand-600)] transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <div className="font-bold text-lg text-slate-900">PropConnect</div>
      </div>
      <LogoutButton isMobile={true} />
    </header>
  );
}
