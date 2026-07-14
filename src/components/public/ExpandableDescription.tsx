"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableDescriptionProps {
  text: string;
  maxLines?: number;
}

export default function ExpandableDescription({ text, maxLines = 4 }: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncatable, setIsTruncatable] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // Compare the scrollHeight with the clientHeight to determine if text overflows
      const isOverflowing = textRef.current.scrollHeight > textRef.current.clientHeight;
      setIsTruncatable(isOverflowing);
    }
  }, [text]);

  return (
    <div className="relative">
      <div 
        ref={textRef}
        className={`text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line transition-all duration-300 ${
          !isExpanded ? `line-clamp-${maxLines}` : ""
        }`}
        style={!isExpanded ? {
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        } : {}}
      >
        {text}
      </div>

      {isTruncatable && !isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}

      {isTruncatable && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-[var(--color-brand-600)] hover:text-[var(--color-brand-700)] font-medium text-sm flex items-center gap-1 transition-colors"
        >
          {isExpanded ? (
            <>Read Less <ChevronUp size={16} /></>
          ) : (
            <>Read More <ChevronDown size={16} /></>
          )}
        </button>
      )}
    </div>
  );
}
