import { prisma } from "@/lib/prisma";
import { Users, Phone, Calendar } from "lucide-react";
import LeadActions from "@/components/admin/LeadActions";
import { generateWhatsAppLink } from "@/lib/whatsapp";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-yellow-100 text-yellow-700",
  SITE_VISIT_SCHEDULED: "bg-purple-100 text-purple-700",
  CONVERTED: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-600",
};

const SOURCE_LABELS: Record<string, string> = {
  FORM: "📋 Form",
  WHATSAPP: "💬 WhatsApp",
  CALL: "📞 Call",
};

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    include: { property: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    total: leads.length,
    new: leads.filter((l) => l.status === "NEW").length,
    contacted: leads.filter((l) => l.status === "CONTACTED").length,
    converted: leads.filter((l) => l.status === "CONVERTED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Leads</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage and track your customer inquiries.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: counts.total, color: "text-slate-700", bg: "bg-slate-50 border-slate-200" },
          { label: "New", value: counts.new, color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
          { label: "Contacted", value: counts.contacted, color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
          { label: "Converted", value: counts.converted, color: "text-green-700", bg: "bg-green-50 border-green-200" },
        ].map((s) => (
          <div key={s.label} className={`card border p-4 ${s.bg}`}>
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Leads Table */}
      <div className="card overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[var(--color-surface-2)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-[var(--color-text-muted)]" size={32} />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">No leads yet</h3>
            <p className="text-[var(--color-text-secondary)] mt-2 max-w-sm mx-auto">
              When customers submit inquiries from your website, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] text-xs uppercase tracking-wider border-b border-[var(--color-border)]">
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Message</th>
                  <th className="p-4 font-semibold">Property</th>
                  <th className="p-4 font-semibold">Source</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {leads.map((lead) => {
                  const waLink = generateWhatsAppLink({
                    propertyTitle: lead.property?.title ?? lead.propertyTitle ?? undefined,
                    source: "admin-leads",
                  });
                  const callLink = `tel:${lead.phone}`;

                  return (
                    <tr key={lead.id} className="hover:bg-[var(--color-surface-2)] transition-colors align-top">
                      {/* Customer */}
                      <td className="p-4">
                        <div className="font-semibold text-sm text-[var(--color-text-primary)]">
                          {lead.name}
                        </div>
                        <a
                          href={callLink}
                          className="text-xs text-[var(--color-brand-600)] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Phone size={11} />
                          {lead.phone}
                        </a>
                        {lead.email && (
                          <div className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate max-w-[160px]">
                            {lead.email}
                          </div>
                        )}
                      </td>

                      {/* Message */}
                      <td className="p-4 max-w-[200px]">
                        {lead.message ? (
                          <p className="text-xs text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed">
                            {lead.message}
                          </p>
                        ) : (
                          <span className="text-xs text-[var(--color-text-muted)]">—</span>
                        )}
                      </td>

                      {/* Property */}
                      <td className="p-4">
                        {lead.property ? (
                          <a
                            href={`/properties/${lead.property.slug}`}
                            target="_blank"
                            className="text-xs text-[var(--color-brand-600)] hover:underline leading-tight line-clamp-2"
                          >
                            {lead.property.title}
                          </a>
                        ) : (
                          <span className="text-xs text-[var(--color-text-muted)]">General</span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="p-4">
                        <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                          {SOURCE_LABELS[lead.source] ?? lead.source}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                            STATUS_COLORS[lead.status] ?? "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {lead.status.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-xs text-[var(--color-text-secondary)] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                          {new Date(lead.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <LeadActions leadId={lead.id} currentStatus={lead.status} waLink={waLink} callLink={callLink} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
