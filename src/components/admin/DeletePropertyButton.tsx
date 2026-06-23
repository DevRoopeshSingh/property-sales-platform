"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProperty } from "@/app/admin/(dashboard)/properties/actions";
import { toast } from "sonner";

interface DeletePropertyButtonProps {
  propertyId: string;
}

export function DeletePropertyButton({ propertyId }: DeletePropertyButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this property? This will permanently delete the property and its images.")) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const result = await deleteProperty(propertyId);
      
      if (result.success) {
        toast.success("Property deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete property");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-[var(--color-text-secondary)] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Delete property"
    >
      {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}
