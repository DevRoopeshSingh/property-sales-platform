"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps extends ImageProps {
  containerClassName?: string;
  skeletonClassName?: string;
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
