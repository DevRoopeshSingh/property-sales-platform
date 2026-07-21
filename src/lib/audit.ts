import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { AuditEventType } from "@prisma/client";

interface AuditLogOptions {
  eventType: AuditEventType;
  action: string;
  tableName?: string;
  recordId?: string;
  oldData?: Record<string, unknown> | null;
  newData?: Record<string, unknown> | null;
  targetUserId?: string;
}

/**
 * Logs an event to the audit_logs table.
 * Automatically fetches the current actor from the session.
 */
export async function logAudit(options: AuditLogOptions) {
  try {
    const session = await auth();
    const actorId = session?.user?.id;

    await prisma.auditLog.create({
      data: {
        eventType: options.eventType,
        action: options.action,
        tableName: options.tableName,
        recordId: options.recordId,
        oldData: options.oldData ? JSON.parse(JSON.stringify(options.oldData)) : null,
        newData: options.newData ? JSON.parse(JSON.stringify(options.newData)) : null,
        actorId,
        targetUserId: options.targetUserId,
        // IP Address and User Agent can be extracted via headers() in next/headers if needed, 
        // but often requires passing down from the request object in Next.js App Router.
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
    // We intentionally don't throw to prevent crashing the main application flow,
    // but in a strict compliance environment, you might want to throw.
  }
}
