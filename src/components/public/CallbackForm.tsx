"use client";

import { useState } from "react";
import { submitLeadAction } from "@/app/actions/lead";
import { Loader2, CheckCircle2 } from "lucide-react";

interface CallbackFormProps {
  propertyTitle?: string;
  onSuccess?: () => void;
}

export default function CallbackForm({ propertyTitle, onSuccess }: CallbackFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      message: propertyTitle ? `Callback request for property: ${propertyTitle}` : "Callback request",
    };

    const result = await submitLeadAction(data);

    setIsPending(false);

    if (result.success) {
      setSuccess(true);
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
      }
    } else {
      setError(result.error || "Something went wrong. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <CheckCircle2 size={40} className="text-green-500 mb-3" />
        <p className="font-semibold text-[var(--color-text-primary)]">Request Sent!</p>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          We&apos;ll call you back within 30 minutes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        className="input text-sm py-2.5 w-full"
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        className="input text-sm py-2.5 w-full"
        required
      />
      <button 
        type="submit" 
        className="btn btn-primary w-full py-2.5 text-sm"
        disabled={isPending}
      >
        {isPending ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Request Callback"}
      </button>
      <p className="text-xs text-[var(--color-text-muted)] text-center">
        We&apos;ll call you back within 30 minutes
      </p>
    </form>
  );
}
