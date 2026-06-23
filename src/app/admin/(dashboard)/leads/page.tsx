import { prisma } from "@/lib/prisma";
import { Users } from "lucide-react";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Leads</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Manage and track your customer inquiries.</p>
      </div>

      <div className="card overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[var(--color-surface-2)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-[var(--color-text-muted)]" size={32} />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">No leads yet</h3>
            <p className="text-[var(--color-text-secondary)] mt-2">
              When customers submit inquiries from your website, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] text-sm border-b border-[var(--color-border)]">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Property</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                    <td className="p-4 font-medium text-[var(--color-text-primary)]">{lead.name}</td>
                    <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                      {lead.phone}
                      <br />
                      <span className="text-xs">{lead.email}</span>
                    </td>
                    <td className="p-4 text-sm text-[var(--color-text-secondary)]">{lead.propertyTitle || "-"}</td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
