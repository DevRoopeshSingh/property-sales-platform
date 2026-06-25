"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileFiltersDrawer({ children, activeFilterCount }: { children: React.ReactNode; activeFilterCount: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 btn bg-white text-[var(--color-text-primary)] border border-[var(--color-border)] py-3 shadow-sm hover:bg-slate-50"
      >
        <SlidersHorizontal size={18} />
        <span className="font-semibold">Filter Properties</span>
        {activeFilterCount > 0 && (
          <span className="ml-1 bg-[var(--color-brand-100)] text-[var(--color-brand-700)] text-xs font-bold px-2 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white z-[110] shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <h2 className="font-bold text-[var(--color-text-primary)] flex items-center gap-2 text-lg">
            <SlidersHorizontal size={20} />
            Filters
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-full text-[var(--color-text-secondary)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>

        <div className="p-5 border-t border-[var(--color-border)] bg-slate-50">
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full btn btn-primary py-3.5 shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
