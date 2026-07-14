"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ImageWithSkeleton from "@/components/ui/loaders/ImageWithSkeleton";

interface PropertyImage {
  id: string;
  url: string;
  altText: string | null;
}

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safely handle body scroll lock and cleanup
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "Escape") setIsOpen(false);
    if (e.key === "ArrowRight") setCurrentIndex((prev) => (prev + 1) % images.length);
    if (e.key === "ArrowLeft") setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [isOpen, images.length]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!images || images.length === 0) {
    return (
      <div className="card overflow-hidden mb-5">
        <div className="w-full h-72 md:h-96 bg-[var(--color-surface-3)] flex items-center justify-center text-[var(--color-text-muted)]">
          No images available
        </div>
      </div>
    );
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="card overflow-hidden mb-5">
        <div className="relative">
          {/* Desktop Grid Layout */}
          <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-1.5 h-96">
            {/* Primary (large) */}
            <div 
              className="col-span-3 row-span-2 relative bg-[var(--color-surface-3)] cursor-pointer group"
              onClick={() => { setCurrentIndex(0); setIsOpen(true); }}
            >
              {images[0] && (
                <ImageWithSkeleton
                  src={images[0].url}
                  alt={images[0].altText ?? title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  priority
                  sizes="60vw"
                />
              )}
            </div>
            {/* Thumbnails */}
            {images.slice(1, 3).map((img, i) => (
              <div 
                key={img.id} 
                className="relative col-span-1 row-span-1 bg-[var(--color-surface-3)] cursor-pointer group"
                onClick={() => { setCurrentIndex(i + 1); setIsOpen(true); }}
              >
                <ImageWithSkeleton
                  src={img.url}
                  alt={img.altText ?? `Photo ${i + 2}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  sizes="20vw"
                />
                {i === 1 && images.length > 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-colors group-hover:bg-black/40">
                    <span className="text-white font-bold text-lg">+{images.length - 3}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Swipe Carousel */}
          <div 
            className="md:hidden flex overflow-x-auto snap-x snap-mandatory h-72 w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {images.map((img, i) => (
              <div 
                key={img.id}
                className="w-full shrink-0 snap-center relative h-full bg-[var(--color-surface-3)]"
                onClick={() => { setCurrentIndex(i); setIsOpen(true); }}
              >
                <ImageWithSkeleton
                  src={img.url}
                  alt={img.altText ?? `Photo ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="100vw"
                />
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-md">
                  {i + 1} / {images.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setIsOpen(false)} // Click outside to close
        >
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 md:top-8 md:right-8 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>

          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 md:left-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 md:right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div 
            className="relative w-full max-w-5xl h-[80vh] px-12 md:px-24 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking the image area
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={images[currentIndex].url} 
              alt={images[currentIndex].altText || title}
              className="max-w-full max-h-full object-contain drop-shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            />
            
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
