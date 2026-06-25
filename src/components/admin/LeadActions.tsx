"use client";

import { useState, useTransition } from "react";
import { Phone, MessageSquare, ChevronDown } from "lucide-react";
import { updateLeadStatus } from "@/app/actions/lead";

const STATUSES = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "SITE_VISIT_SCHEDULED", label: "Visit Scheduled" },
  { value: "CONVERTED", label: "Converted" },
  { value: "LOST", label: "Lost" },
];

interface LeadActionsProps {
  leadId: string;
  currentStatus: string;
  waLink: string;
  callLink: string;
}

export default function LeadActions({ leadId, currentStatus, waLink, callLink }: LeadActionsProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    startTransition(async () => {
      await updateLeadStatus(leadId, newStatus);
    });
  };

  return (
    <div className="flex flex-col gap-2 min-w-[120px]">
      {/* Quick Action Buttons */}
      <div className="flex gap-1.5">
        <a
          href={callLink}
          className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
          title="Call"
          aria-label="Call lead"
        >
          <Phone size={13} />
        </a>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-slate-100 hover:bg-green-100 text-slate-600 hover:text-green-700 transition-colors"
          title="WhatsApp"
          aria-label="WhatsApp lead"
        >
          <MessageSquare size={13} />
        </a>
      </div>

      {/* Status Dropdown */}
      <div className="relative">
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isPending}
          className="w-full text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] cursor-pointer hover:border-[var(--color-brand-400)] transition-colors appearance-none pr-6 disabled:opacity-60"
          aria-label="Update lead status"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}
