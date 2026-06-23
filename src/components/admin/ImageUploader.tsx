"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export interface PropertyImageInput {
  url: string;
  key: string;
  altText?: string | null;
  isPrimary: boolean;
}

interface ImageUploaderProps {
  value: PropertyImageInput[];
  onChange: (value: PropertyImageInput[]) => void;
  maxImages?: number;
}

export function ImageUploader({ value = [], onChange, maxImages = 10 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (value.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images.`);
      return;
    }

    setIsUploading(true);
    setError(null);

    const newImages = [...value];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Generate a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("properties")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("properties")
          .getPublicUrl(filePath);

        newImages.push({
          url: publicUrl,
          key: filePath,
          altText: file.name,
          isPrimary: newImages.length === 0, // First image is primary by default
        });
      }

      onChange(newImages);
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setError(err.message || "Failed to upload image. Make sure the 'properties' bucket exists and is public.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input
      }
    }
  };

  const handleRemove = async (indexToRemove: number) => {
    const imageToRemove = value[indexToRemove];
    
    // Optional: Delete from Supabase immediately, or just remove from UI
    // await supabase.storage.from("properties").remove([imageToRemove.key]);

    const newImages = value.filter((_, idx) => idx !== indexToRemove);
    
    // If we removed the primary image, make the first remaining image primary
    if (imageToRemove.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    onChange(newImages);
  };

  const setPrimary = (indexToSet: number) => {
    const newImages = value.map((img, idx) => ({
      ...img,
      isPrimary: idx === indexToSet,
    }));
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((image, index) => (
            <div
              key={image.key}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 ${
                image.isPrimary ? "border-[var(--color-brand-500)]" : "border-transparent"
              } group bg-[var(--color-surface-2)]`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.altText || "Property image"}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-between w-full">
                  {!image.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimary(index)}
                      className="text-xs bg-white text-black px-2 py-1 rounded-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Set Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors ml-auto"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              
              {image.isPrimary && (
                <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-brand-500)] text-white text-[10px] text-center py-1 font-bold">
                  PRIMARY IMAGE
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {value.length < maxImages && (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center cursor-pointer hover:border-[var(--color-brand-400)] hover:bg-[var(--color-surface-2)] transition-colors ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center space-y-3">
            {isUploading ? (
              <Loader2 className="animate-spin text-[var(--color-brand-500)]" size={32} />
            ) : (
              <Upload className="text-[var(--color-text-muted)]" size={32} />
            )}
            
            <div className="text-sm">
              {isUploading ? (
                <p className="font-medium text-[var(--color-text-primary)]">Uploading images...</p>
              ) : (
                <>
                  <p className="font-medium text-[var(--color-text-primary)]">
                    Click to upload images
                  </p>
                  <p className="text-[var(--color-text-muted)] mt-1">
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </p>
                </>
              )}
            </div>
            
            <p className="text-xs text-[var(--color-text-muted)]">
              {value.length} of {maxImages} images uploaded
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
