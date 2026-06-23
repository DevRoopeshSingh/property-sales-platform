import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import StickyContactBar from "@/components/public/StickyContactBar";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us — PropConnect",
  description:
    "Get in touch with our property experts. Chat on WhatsApp, call us, or fill the inquiry form. Available 7 days a week for property consultations.",
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <div className="hero-gradient py-14">
        <div className="container-main text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Get in Touch
          </h1>
          <p className="text-lg text-white/75 max-w-xl mx-auto">
            Our property experts are here to help you find your dream property.
            Reach out anytime on WhatsApp or call us directly.
          </p>
        </div>
      </div>

      <div className="container-main py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Contact Info ── */}
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Contact Information</h2>

            <div className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--color-brand-100)" }}>
                  <Phone size={18} className="text-[var(--color-brand-600)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Phone</p>
                  <a href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE}`} className="text-sm text-[var(--color-brand-600)] hover:underline">
                    {process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+91 98765 43210"}
                  </a>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#dcfce7" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#16a34a">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.057 23.927l6.236-1.637A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.369l-.359-.214-3.717.976.993-3.624-.234-.372A9.818 9.818 0 0112 2.182c5.421 0 9.818 4.397 9.818 9.818S17.421 21.818 12 21.818z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">WhatsApp</p>
                  <a
                    href={generateWhatsAppLink({ source: "contact-page" })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:underline"
                  >
                    Chat with us instantly
                  </a>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--color-brand-100)" }}>
                  <Mail size={18} className="text-[var(--color-brand-600)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Email</p>
                  <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`} className="text-sm text-[var(--color-brand-600)] hover:underline">
                    {process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@propconnect.in"}
                  </a>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--color-brand-100)" }}>
                  <MapPin size={18} className="text-[var(--color-brand-600)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Office</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Mumbai Metropolitan Region,<br />Maharashtra, India
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--color-brand-100)" }}>
                  <Clock size={18} className="text-[var(--color-brand-600)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Working Hours</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Mon – Sat: 9:00 AM – 7:00 PM<br />
                    Sunday: 10:00 AM – 5:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp primary CTA */}
            <a
              href={generateWhatsAppLink({ source: "contact-page-cta" })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp w-full py-3.5 text-base"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.057 23.927l6.236-1.637A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.369l-.359-.214-3.717.976.993-3.624-.234-.372A9.818 9.818 0 0112 2.182c5.421 0 9.818 4.397 9.818 9.818S17.421 21.818 12 21.818z" />
              </svg>
              Chat on WhatsApp Now
            </a>
          </div>

          {/* ── Inquiry Form ── */}
          <div className="lg:col-span-2">
            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">
                Send us an Inquiry
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                Fill in the form below and we&apos;ll get back to you within 30 minutes.
              </p>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Rahul Sharma"
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="rahul@email.com"
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="property-type" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                      Property Interest
                    </label>
                    <select id="property-type" className="input cursor-pointer">
                      <option value="">Select property type</option>
                      <option>Apartment</option>
                      <option>Villa</option>
                      <option>Independent House</option>
                      <option>Plot</option>
                      <option>Office</option>
                      <option>Shop</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                      Budget Range
                    </label>
                    <select id="budget" className="input cursor-pointer">
                      <option value="">Select budget</option>
                      <option>Under ₹30 Lakhs</option>
                      <option>₹30L – ₹60L</option>
                      <option>₹60L – ₹1 Cr</option>
                      <option>₹1 Cr – ₹2 Cr</option>
                      <option>Above ₹2 Cr</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us more about what you're looking for..."
                    className="input resize-none"
                  />
                </div>

                <button
                  type="submit"
                  id="contact-form-submit"
                  className="btn btn-primary w-full py-3.5 text-base"
                >
                  Send Inquiry
                </button>

                <p className="text-xs text-center text-[var(--color-text-muted)]">
                  By submitting, you agree to be contacted by our team.
                  We respect your privacy and won&apos;t spam you.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <StickyContactBar />
    </>
  );
}
