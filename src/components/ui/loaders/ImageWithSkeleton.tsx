"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps extends ImageProps {
  containerClassName?: string;
  skeletonClassName?: string;
}

// These hostnames bypass Next.js image optimization.
// Supabase storage URLs resolve to private IPs in some environments,
// which Next.js blocks for security. Serving them unoptimized avoids this.
const UNOPTIMIZED_HOSTS = ["supabase.co", "supabase.in"];

function shouldBypassOptimization(src: ImageProps["src"]): boolean {
  if (typeof src !== "string") return false;
  try {
    const url = new URL(src);
    return UNOPTIMIZED_HOSTS.some((host) => url.hostname.endsWith(host));
  } catch {
    return false;
  }
}

export default function ImageWithSkeleton({
  src,
  alt,
  className,
  containerClassName,
  skeletonClassName,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const unoptimized = props.unoptimized ?? shouldBypassOptimization(src);

  return (
    <div className={cn("relative overflow-hidden w-full h-full", containerClassName)}>
      {/* The Skeleton Background */}
      <div
        className={cn(
          "absolute inset-0 bg-slate-200 animate-pulse transition-opacity duration-500",
          isLoaded ? "opacity-0" : "opacity-100",
          skeletonClassName
        )}
      />

      {/* The Actual Image */}
      <Image
        src={src}
        alt={alt}
        unoptimized={unoptimized}
        className={cn(
          "transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}
