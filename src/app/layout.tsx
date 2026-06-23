import type { Metadata } from "next";
import "./globals.css";


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

import LayoutWrapper from "@/components/public/LayoutWrapper";
import NavigationProgressBar from "@/components/ui/loaders/NavigationProgressBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <NavigationProgressBar />
        <LayoutWrapper>
          <main>{children}</main>
        </LayoutWrapper>
      </body>
    </html>
  );
}
