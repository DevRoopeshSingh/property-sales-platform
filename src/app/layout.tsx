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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PropConnect",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: "PropConnect",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    google: "R0m0UC17ICxh4cWO2XWUBycVZqN_5bkhQiZlg2eFXAc",
  },
};

export const viewport = {
  themeColor: "#1a6fe8",
};

import LayoutWrapper from "@/components/public/LayoutWrapper";
import NavigationProgressBar from "@/components/ui/loaders/NavigationProgressBar";
import { Toaster } from "sonner";
import { getPublicSettings } from "@/app/admin/(dashboard)/settings/actions";
import { SettingsProvider } from "@/contexts/SettingsContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global settings once per request to pass into context
  const settings = await getPublicSettings().catch(() => ({} as Record<string, string>));

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body suppressHydrationWarning>
        <SettingsProvider settings={settings}>
          <NavigationProgressBar />
          <Toaster richColors position="top-center" />
          <LayoutWrapper>
            <main>{children}</main>
          </LayoutWrapper>
        </SettingsProvider>
      </body>
    </html>
  );
}
