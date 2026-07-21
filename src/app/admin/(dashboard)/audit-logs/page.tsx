import { requireRole, ROLE_GROUPS } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { AuditLogsTable } from "@/components/admin/audit-logs/AuditLogsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Logs | Admin",
};

export default async function AuditLogsPage() {
  // Only SUPER_ADMIN can view audit logs
  await requireRole(ROLE_GROUPS.SYSTEM_ADMINS);

  // Fetch recent logs with actor details
  const rawLogs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: {
      actor: {
        select: { name: true, email: true }
      },
      targetUser: {
        select: { name: true, email: true }
      }
    }
  });

  const logs = rawLogs.map(log => ({
    ...log,
    oldData: log.oldData as Record<string, unknown> | null,
    newData: log.newData as Record<string, unknown> | null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Audit Logs</h1>
          <p className="text-slate-500 mt-2">Immutable record of security events and data mutations.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <AuditLogsTable initialLogs={logs} />
      </div>
    </div>
  );
}
