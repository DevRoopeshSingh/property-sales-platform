"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Phone, ChevronDown, Heart } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { useSettings } from "@/contexts/SettingsContext";

const NAV_LINKS = [
  { label: "Properties", href: "/properties" },
  {
    label: "Property Type",
    children: [
      { label: "Apartments", href: "/properties?subType=APARTMENT" },
      { label: "Villas", href: "/properties?subType=VILLA" },
      { label: "Independent Houses", href: "/properties?subType=INDEPENDENT_HOUSE" },
      { label: "Row Houses", href: "/properties?subType=ROW_HOUSE" },
      { label: "Plots", href: "/properties?subType=PLOT" },
      { label: "Shops", href: "/properties?subType=SHOP" },
      { label: "Offices", href: "/properties?subType=OFFICE" },
      { label: "Showrooms", href: "/properties?subType=SHOWROOM" },
    ],
  },
  {
    label: "Localities",
    children: [
      { label: "Vashi", href: "/localities/vashi" },
      { label: "Kharghar", href: "/localities/kharghar" },
      { label: "Seawoods", href: "/localities/seawoods" },
      { label: "Nerul", href: "/localities/nerul" },
      { label: "CBD Belapur", href: "/localities/cbd-belapur" },
      { label: "Airoli", href: "/localities/airoli" },
      { label: "Panvel", href: "/localities/panvel" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const settings = useSettings();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[var(--color-border)] shadow-sm">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.png" alt="PropConnect Logo" width={144} height={36} className="h-9 w-auto object-contain" priority />
            <span className="font-extrabold text-xl text-[var(--color-text-primary)] hidden sm:block">
              Prop<span style={{ color: "var(--color-brand-600)" }}>Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-brand-600)] rounded-lg hover:bg-[var(--color-brand-50)] transition-colors">
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${openDropdown === link.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 pt-1.5 z-50">
                      <div className="w-52 bg-white border border-[var(--color-border)] rounded-xl shadow-lg py-1.5 animate-fade-in">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-600)] hover:bg-[var(--color-brand-50)] transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-brand-600)] rounded-lg hover:bg-[var(--color-brand-50)] transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="relative group flex items-center mr-2">
              <Link href="/saved" className="p-2 text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" aria-label="Saved Properties">
                <Heart size={20} />
              </Link>
              <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[11px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-sm z-50">
                Saved Properties
              </div>
            </div>
            <div className="flex flex-col gap-0.5 mr-2">
              <a
                href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE}`}
                className="text-[13px] font-medium hover:text-[var(--color-brand-600)] transition-colors flex items-center gap-1.5"
              >
                <Phone size={13} />
                {process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+91 98333 78400"}
              </a>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE_ALT}`}
                className="text-[13px] font-medium hover:text-[var(--color-brand-600)] transition-colors flex items-center gap-1.5"
              >
                <Phone size={13} />
                {process.env.NEXT_PUBLIC_CONTACT_PHONE_ALT ?? "+91 93216 70367"}
              </a>
            </div>
            <a
              href={generateWhatsAppLink({ source: "navbar", settings })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp text-sm px-4 py-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.057 23.927l6.236-1.637A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.369l-.359-.214-3.717.976.993-3.624-.234-.372A9.818 9.818 0 0112 2.182c5.421 0 9.818 4.397 9.818 9.818S17.421 21.818 12 21.818z" />
              </svg>
              WhatsApp Us
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-1">
            <Link href="/saved" className="p-2 text-[var(--color-text-secondary)] hover:text-red-500 transition-colors" aria-label="Saved Properties">
              <Heart size={22} />
            </Link>
            <button
              className="p-2 rounded-lg hover:bg-[var(--color-surface-3)] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[var(--color-border)] animate-fade-in">
          <nav className="container-main py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {link.label}
                  </p>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-5 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-600)] rounded-lg"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-brand-600)] rounded-lg hover:bg-[var(--color-brand-50)]"
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="divider" />
            <a
              href={generateWhatsAppLink({ source: "mobile-nav", settings })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp w-full"
            >
              💬 Chat on WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
