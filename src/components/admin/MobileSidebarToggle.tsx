"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminNav } from "./AdminNav";

export function MobileSidebarToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-slate-600 hover:text-[var(--color-brand-600)] transition-colors"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <span className="font-bold text-xl tracking-tight">
            Prop<span className="text-blue-400">Connect</span>
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2" onClick={() => setIsOpen(false)}>
          <AdminNav />
        </div>
      </div>
    </>
  );
}
