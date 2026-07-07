"use client";

import { usePathname } from "next/navigation";

export default function AnnouncementBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // If you only want it on the homepage, keep this check. 
  // If you want it everywhere, remove this conditional return.
  if (!isHome) return null;

  const messages = [
    "100% RERA Verified",
    "Zero Brokerage on New Launch Projects",
    "Best Price Guaranteed",
    "Dedicated Local Experts",
    "Instant WhatsApp Support",
    "Premium Properties in Navi Mumbai"
  ];

  // We duplicate the array to create a seamless infinite scroll loop
  const marqueeItems = [...messages, ...messages];

  return (
    <div className="bg-[var(--color-brand-600)] text-white overflow-hidden py-2 border-b border-[var(--color-brand-700)]">
      <div className="relative flex whitespace-nowrap overflow-hidden group">
        <div className="animate-marquee inline-flex space-x-12 group-hover:[animation-play-state:paused]">
          {marqueeItems.map((msg, idx) => (
            <span key={idx} className="flex items-center text-xs sm:text-sm font-medium tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-300)] mr-3 opacity-70"></span>
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
