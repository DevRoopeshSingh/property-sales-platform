import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export const metadata: Metadata = {
  title: {
    default: "PropConnect — Find Your Dream Property in Mumbai",
    template: "%s | PropConnect",
  },
  description:
    "Discover premium residential and commercial properties across Mumbai, Navi Mumbai, Thane, Vasai-Virar. Connect instantly on WhatsApp.",
  keywords: ["property in mumbai", "flats in virar", "apartments thane", "buy property mumbai"],
  authors: [{ name: "PropConnect" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
  openGraph: {
    siteName: "PropConnect",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
