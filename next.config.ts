import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // cacheOnFrontEndNav: true,
  // reloadOnOnline: true,
  fallbacks: {
    document: "/offline",
  },
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      // Allow Unsplash for demo images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Allow Supabase for uploaded property images
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
    // Disable the private-IP protection that blocks Supabase storage in dev
    dangerouslyAllowSVG: false,
  },
  // Allow Next.js image optimization to connect to Supabase storage
  // (Supabase URLs resolve to private-range IPs in some environments)
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default withPWA(nextConfig);
