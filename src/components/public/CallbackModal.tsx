"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Headset } from "lucide-react";
import CallbackForm from "./CallbackForm";

interface CallbackModalProps {
  propertyTitle?: string;
  triggerButtonText?: string;
  triggerButtonClass?: string;
}

export default function CallbackModal({ 
  propertyTitle, 
  triggerButtonText = "Request Callback", 
  triggerButtonClass = "btn btn-primary"
}: CallbackModalProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isOpen && e.key === "Escape") {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <button 
        onClick={(e) => { e.preventDefault(); setIsOpen(true); }}
        className={triggerButtonClass}
      >
        <Headset size={16} className="mr-1.5" />
        {triggerButtonText}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
              <h3 className="font-bold text-[var(--color-text-primary)]">Request a Callback</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-full hover:bg-[var(--color-surface-2)] transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <CallbackForm 
                propertyTitle={propertyTitle} 
                onSuccess={() => setTimeout(() => setIsOpen(false), 2000)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
