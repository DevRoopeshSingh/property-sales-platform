import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { useSettings } from "@/contexts/SettingsContext";

const LOCALITIES = [
  { label: "Mumbai", href: "/localities/mumbai" },
  { label: "Navi Mumbai", href: "/localities/navi-mumbai" },
  { label: "Thane", href: "/localities/thane" },
  { label: "Mira Road", href: "/localities/mira-road" },
  { label: "Vasai", href: "/localities/vasai" },
  { label: "Nalasopara", href: "/localities/nalasopara" },
  { label: "Virar", href: "/localities/virar" },
];

const PROPERTY_TYPES = [
  { label: "Apartments", href: "/properties?subType=APARTMENT" },
  { label: "Villas", href: "/properties?subType=VILLA" },
  { label: "Independent Houses", href: "/properties?subType=INDEPENDENT_HOUSE" },
  { label: "Plots", href: "/properties?subType=PLOT" },
  { label: "Offices", href: "/properties?subType=OFFICE" },
  { label: "Shops", href: "/properties?subType=SHOP" },
];

export default function Footer() {
  const settings = useSettings();

  return (
    <footer style={{ background: "var(--color-text-primary)", color: "white" }}>
      {/* Main Footer */}
      <div className="container-main py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ background: "var(--color-brand-600)" }}
              >
                P
              </div>
              <span className="font-extrabold text-xl">
                Prop<span style={{ color: "var(--color-brand-400)" }}>Connect</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm mb-6 max-w-xs leading-relaxed">
            {settings.siteName || "PropConnect"} — Discover premium residential and commercial properties across {settings.defaultCity || "Mumbai"}. Connect directly with experts for a seamless experience.
          </p>
            <a
              href={generateWhatsAppLink({ source: "footer", settings })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.057 23.927l6.236-1.637A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.369l-.359-.214-3.717.976.993-3.624-.234-.372A9.818 9.818 0 0112 2.182c5.421 0 9.818 4.397 9.818 9.818S17.421 21.818 12 21.818z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Property Types
            </h3>
            <ul className="space-y-2.5">
              {PROPERTY_TYPES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Localities */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Localities
            </h3>
            <ul className="space-y-2.5">
              {LOCALITIES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={15} className="mt-0.5 shrink-0" style={{ color: "var(--color-brand-400)" }} />
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE}`}
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+91 98765 43210"}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="mt-0.5 shrink-0" style={{ color: "var(--color-brand-400)" }} />
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "enquiry@thepropconnect.in"}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: "var(--color-brand-400)" }} />
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Mumbai Metropolitan Region, Maharashtra, India
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container-main py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          <p>© {new Date().getFullYear()} PropConnect. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
