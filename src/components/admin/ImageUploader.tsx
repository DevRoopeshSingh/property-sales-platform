"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Download, Archive } from "lucide-react";
import { toast } from "sonner";
import { deleteImagesFromStorage, uploadImageToStorage } from "@/app/admin/(dashboard)/properties/storage-actions";
import { deletePropertyImage } from "@/app/admin/(dashboard)/properties/actions";
import { DndContext, closestCenter, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface PropertyImageInput {
  id?: string;           // DB record id — present for existing images, absent for new uploads
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

function SortableImageItem({ 
  image, 
  onSetPrimary, 
  onRemove,
  onDownload
}: { 
  image: PropertyImageInput; 
  onSetPrimary: () => void; 
  onRemove: () => void;
  onDownload: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.key });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative aspect-video rounded-lg overflow-hidden border-2 ${
        image.isPrimary ? "border-[var(--color-brand-500)]" : "border-transparent"
      } group bg-[var(--color-surface-2)]`}
    >
      {/* Drag handle area */}
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-10 touch-none" 
      />
      
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.altText || "Property image"}
        className="w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20 pointer-events-none group-hover:pointer-events-auto">
        <div className="flex justify-between w-full">
          {!image.isPrimary && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSetPrimary(); }}
              className="text-xs bg-white text-black px-2 py-1 rounded-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Set Primary
            </button>
          )}
          
          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDownload(); }}
              className="p-1 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
              title="Download image"
            >
              <Download size={14} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
      
      {image.isPrimary && (
        <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-brand-500)] text-white text-[10px] text-center py-1 font-bold z-20">
          PRIMARY IMAGE
        </div>
      )}
    </div>
  );
}

export function ImageUploader({ value = [], onChange, maxImages = 10 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // === Individual Download Handler ===
  const handleDownloadSingle = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename || "property-image.jpg";
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download image. Try right-clicking and saving.");
    }
  };

  // === Download All Handler ===
  const handleDownloadAll = async () => {
    if (value.length === 0) return;
    setIsZipping(true);
    
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Fetch all images concurrently
      await Promise.all(
        value.map(async (img, index) => {
          try {
            const response = await fetch(img.url);
            if (!response.ok) return;

            const arrayBuffer = await response.arrayBuffer();
            // Generate a safe filename
            let ext = img.url.split(".").pop()?.split("?")[0] || "jpg";
            if (ext.length > 4) ext = "jpg"; // fallback if URL lacks extension
            
            const filename = img.altText 
              ? `${img.altText.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`
              : `property-image-${index + 1}.${ext}`;

            // Add to zip archive
            zip.file(filename, arrayBuffer);
          } catch (err) {
            console.error(`Failed to fetch image ${img.url}`, err);
          }
        })
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const objectUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "property-photos.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      
      toast.success("Images downloaded successfully!");
    } catch (err) {
      console.error("ZIP Generation Error:", err);
      toast.error("Failed to generate ZIP archive.");
    } finally {
      setIsZipping(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: FileList | null = null;
    if ('dataTransfer' in e) {
        files = e.dataTransfer.files;
    } else {
        files = e.target.files;
    }
    
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

        // Upload to Supabase Storage via Server Action to bypass RLS
        const formData = new FormData();
        formData.append("file", file);
        formData.append("filePath", filePath);

        const uploadResult = await uploadImageToStorage(formData);

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload image");
        }

        newImages.push({
          url: uploadResult.publicUrl as string,
          key: uploadResult.key as string,
          altText: file.name,
          isPrimary: newImages.length === 0, // First image is primary by default
        });
      }

      onChange(newImages);
    } catch (err: unknown) {
      console.error("Error uploading image:", err);
      const errorMessage = (err as Error).message || "Failed to upload image. Make sure the 'properties' bucket exists and is public.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input
      }
    }
  };

  const handleRemove = async (indexToRemove: number) => {
    const imageToRemove = value[indexToRemove];

    if (imageToRemove.id) {
      // Existing DB image: delete from both DB and storage in one server action.
      // This persists the removal immediately — no form save required.
      const res = await deletePropertyImage(imageToRemove.id, imageToRemove.key);
      if (!res.success) {
        toast.error(res.error || "Failed to delete image.");
        return; // Don't update local state if server delete failed
      }
      toast.success("Image removed");
    } else {
      // Newly uploaded image (not yet saved to DB): only remove from storage.
      const res = await deleteImagesFromStorage([imageToRemove.key]);
      if (!res.success) {
        toast.error("Failed to delete image from storage.");
        // Continue anyway — update local state so user can retry by saving
      } else {
        toast.success("Image removed");
      }
    }

    const newImages = value.filter((_, idx) => idx !== indexToRemove);

    // If we removed the primary image, make the first remaining image primary
    if (imageToRemove.isPrimary && newImages.length > 0) {
      newImages[0] = { ...newImages[0], isPrimary: true };
    }

    onChange(newImages);
  };

  const setPrimary = (indexToSet: number) => {
    // Physically move the selected image to index 0
    const reordered = arrayMove(value, indexToSet, 0);
    const newImages = reordered.map((img, idx) => ({
      ...img,
      isPrimary: idx === 0,
    }));
    onChange(newImages);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = value.findIndex((img) => img.key === active.id);
    const newIndex = value.findIndex((img) => img.key === over.id);

    let newImages = arrayMove(value, oldIndex, newIndex);
    
    // Re-evaluate primary if index 0 changed
    newImages = newImages.map((img, idx) => ({
      ...img,
      isPrimary: idx === 0
    }));

    onChange(newImages);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts, allows clicks to pass through
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Header controls for Download All */}
      {value.length > 0 && (
        <div className="flex justify-between items-center bg-[var(--color-surface-2)] p-3 rounded-lg border border-[var(--color-border)]">
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            {value.length} image{value.length > 1 ? 's' : ''} uploaded
          </span>
          <button
            type="button"
            onClick={handleDownloadAll}
            disabled={isZipping}
            className="btn btn-outline text-xs py-1.5 flex items-center gap-1.5"
          >
            {isZipping ? <Loader2 size={14} className="animate-spin" /> : <Archive size={14} />}
            Download All (ZIP)
          </button>
        </div>
      )}

      {/* Image Grid */}
      {value.length > 0 && (
        <DndContext id="dnd-image-uploader" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={value.map(v => v.key)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {value.map((image, index) => (
                <SortableImageItem 
                  key={image.key}
                  image={image}
                  onSetPrimary={() => setPrimary(index)}
                  onRemove={() => handleRemove(index)}
                  onDownload={() => handleDownloadSingle(image.url, image.altText || `image-${index}.jpg`)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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

