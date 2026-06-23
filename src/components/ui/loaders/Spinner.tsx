"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 20, className }: SpinnerProps) {
  return (
    <Loader2 
      className={cn("animate-spin text-current", className)} 
      size={size} 
    />
  );
}

export function ButtonSpinner({ className }: { className?: string }) {
  return (
    <Loader2 
      className={cn("animate-spin", className)} 
      size={18} 
    />
  );
}
