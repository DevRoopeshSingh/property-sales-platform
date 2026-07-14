"use client";

import { useState } from "react";
import { Share2, Check, Loader2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  url: string;
  text?: string;
  className?: string;
}

export default function ShareButton({ title, url, text, className = "" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (isSharing) return;
    
    if (navigator.share) {
      setIsSharing(true);
      try {
        await navigator.share({
          title,
          text: text || `Check out this property: ${title}`,
          url,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          fallbackCopy();
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleShare}
      disabled={isSharing}
      className={`inline-flex items-center justify-center gap-1.5 transition-colors ${className} ${isSharing ? "opacity-80" : ""}`}
      aria-label="Share property"
      title="Share property"
    >
      {isSharing ? (
        <Loader2 size={16} className="animate-spin" />
      ) : copied ? (
        <Check size={16} className="text-green-600" />
      ) : (
        <Share2 size={16} />
      )}
      <span className="text-sm font-medium">
        {isSharing ? "Sharing..." : copied ? "Copied!" : "Share"}
      </span>
    </button>
  );
}
