"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createManualLead } from "@/app/actions/lead";
import { toast } from "sonner";
import { Users, Phone, Mail, FileText, Share2, Save, X } from "lucide-react";
import Link from "next/link";

export default function AddLeadForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    source: "CALL" as "WHATSAPP" | "CALL" | "FORM",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Name and Phone are required.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await createManualLead(formData);
      
      if (res.success) {
        toast.success("Lead created successfully");
        router.push("/admin/leads");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to create lead");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-semibold text-slate-800">Lead Details</h2>
        <p className="text-sm text-slate-500 mt-1">Enter the customer's contact information and inquiry details.</p>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" /> Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-slate-400" /> Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 9876543210"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-slate-400" /> Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. john@example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900"
            />
          </div>

          {/* Source */}
          <div className="space-y-2">
            <label htmlFor="source" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-slate-400" /> Source <span className="text-red-500">*</span>
            </label>
            <select
              id="source"
              name="source"
              required
              value={formData.source}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white"
            >
              <option value="CALL">Phone Call</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="FORM">Website Form</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-400" /> Inquiry Details / Notes
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="What is the customer looking for?"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 resize-y"
          />
        </div>
      </div>
      
      <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
        <Link 
          href="/admin/leads"
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" /> Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
        >
          <Save className="w-4 h-4" /> 
          {isSubmitting ? "Saving..." : "Save Lead"}
        </button>
      </div>
    </form>
  );
}
