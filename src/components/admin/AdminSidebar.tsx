"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminNav } from "./AdminNav";
import { LogoutButton } from "./LogoutButton";
import { AdminRole } from "@prisma/client";

interface AdminSidebarProps {
  isMinimized: boolean;
  setIsMinimized: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
  userRole?: AdminRole;
}

export function AdminSidebar({
  isMinimized,
  setIsMinimized,
  isMobileOpen,
  setIsMobileOpen,
  userRole,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 bg-slate-900 text-white flex flex-col
        transition-all duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        ${isMinimized ? "md:w-20" : "md:w-64 w-64"}
      `}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between h-16 shrink-0">
        {!isMinimized && (
          <span className="font-bold text-xl tracking-tight whitespace-nowrap">
            Prop<span className="text-blue-400">Connect</span>
          </span>
        )}
        {isMinimized && (
          <span className="font-bold text-xl tracking-tight text-blue-400 mx-auto">
            PC
          </span>
        )}

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors md:hidden"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        {/* Desktop Minimize/Maximize Button */}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="hidden md:flex p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
        >
          {isMinimized ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Area - Scrollable */}
      <div className="flex-1 overflow-y-auto py-4">
        <AdminNav isMinimized={isMinimized} userRole={userRole} />
      </div>

      {/* Footer Area - Pinned */}
      <div className="p-4 border-t border-slate-800 shrink-0">
        <LogoutButton isMinimized={isMinimized} />
      </div>
    </aside>
  );
}
