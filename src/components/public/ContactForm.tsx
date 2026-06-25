"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadFormSchema, type LeadFormValues } from "@/lib/validations/lead";
import { submitLeadAction } from "@/app/actions/lead";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      propertyType: "",
      budget: "",
      message: "",
    },
  });

  const onSubmit = async (data: LeadFormValues) => {
    setServerError(null);
    const result = await submitLeadAction(data);
    
    if (result.success) {
      setIsSuccess(true);
      reset();
    } else {
      setServerError(result.error || "Something went wrong.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-green-50/50 rounded-2xl border border-green-100">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Inquiry Sent Successfully!</h3>
        <p className="text-slate-600 mb-6">
          Thank you for reaching out. One of our property experts will get back to you shortly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="btn btn-outline text-sm"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            placeholder="Rahul Sharma"
            className={cn("input", errors.name && "border-red-300 focus:ring-red-200")}
            {...register("name")}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            className={cn("input", errors.phone && "border-red-300 focus:ring-red-200")}
            {...register("phone")}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="rahul@email.com"
          className={cn("input", errors.email && "border-red-300 focus:ring-red-200")}
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Property Interest
          </label>
          <select id="propertyType" className="input cursor-pointer" {...register("propertyType")}>
            <option value="">Select property type</option>
            <option>Apartment</option>
            <option>Villa</option>
            <option>Independent House</option>
            <option>Plot</option>
            <option>Office</option>
            <option>Shop</option>
          </select>
        </div>
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Budget Range
          </label>
          <select id="budget" className="input cursor-pointer" {...register("budget")}>
            <option value="">Select budget</option>
            <option>Under ₹30 Lakhs</option>
            <option>₹30L – ₹60L</option>
            <option>₹60L – ₹1 Cr</option>
            <option>₹1 Cr – ₹2 Cr</option>
            <option>Above ₹2 Cr</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Tell us more about what you're looking for..."
          className="input resize-none"
          {...register("message")}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 size={18} className="animate-spin" />}
        {isSubmitting ? "Sending..." : "Send Inquiry"}
      </button>

      <p className="text-xs text-center text-[var(--color-text-muted)]">
        By submitting, you agree to be contacted by our team.
        We respect your privacy and won&apos;t spam you.
      </p>
    </form>
  );
}
