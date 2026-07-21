"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";

interface LocationData {
  id: string;
  name: string;
  slug: string;
  _count?: { properties: number };
}

export default function LayoutWrapper({ children, topLocations = [] }: { children: React.ReactNode, topLocations?: LocationData[] }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && (
        <>
          <AnnouncementBar />
          <Navbar topLocations={topLocations} />
        </>
      )}
      {children}
      {!isAdmin && <Footer topLocations={topLocations} />}
    </>
  );
}
