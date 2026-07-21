"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, ROLE_GROUPS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { AdminRole, AuditEventType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createAdminUser(data: { 
  email: string; 
  name?: string; 
  role: AdminRole;
  password?: string;
  forcePasswordChange?: boolean;
}) {
  const actor = await requireRole(ROLE_GROUPS.SYSTEM_ADMINS);

  let finalPassword = data.password;
  let tempPassword = null;

  if (!finalPassword) {
    tempPassword = Math.random().toString(36).slice(-8);
    finalPassword = tempPassword;
  }

  const hashedPassword = await bcrypt.hash(finalPassword, 10);
  const forcePasswordChange = data.forcePasswordChange !== undefined ? data.forcePasswordChange : true;

  const user = await prisma.adminUser.create({
    data: {
      email: data.email,
      name: data.name,
      role: data.role,
      password: hashedPassword,
      forcePasswordChange,
      createdById: actor.id,
    },
  });

  await logAudit({
    eventType: AuditEventType.ACCOUNT_EVENT,
    action: "USER_CREATED",
    targetUserId: user.id,
    newData: { email: user.email, role: user.role, forcePasswordChange },
  });

  revalidatePath("/admin/users");
  return { success: true, tempPassword }; // Return temp password only if it was generated
}

export async function updateAdminRole(userId: string, newRole: AdminRole) {
  const actor = await requireRole(ROLE_GROUPS.SYSTEM_ADMINS);

  if (userId === actor.id) {
    throw new Error("Cannot change your own role");
  }

  const oldUser = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!oldUser) throw new Error("User not found");

  const updatedUser = await prisma.adminUser.update({
    where: { id: userId },
    data: { role: newRole, updatedById: actor.id },
  });

  await logAudit({
    eventType: AuditEventType.ACCOUNT_EVENT,
    action: "ROLE_CHANGED",
    targetUserId: userId,
    oldData: { role: oldUser.role },
    newData: { role: updatedUser.role },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleAdminStatus(userId: string, isActive: boolean) {
  const actor = await requireRole(ROLE_GROUPS.SYSTEM_ADMINS);

  if (userId === actor.id) {
    throw new Error("Cannot disable your own account");
  }

  // Prevent disabling the last super admin
  if (!isActive) {
    const user = await prisma.adminUser.findUnique({ where: { id: userId } });
    if (user?.role === "SUPER_ADMIN") {
      const superAdminCount = await prisma.adminUser.count({
        where: { role: "SUPER_ADMIN", isActive: true },
      });
      if (superAdminCount <= 1) {
        throw new Error("Cannot disable the last active SUPER_ADMIN");
      }
    }
  }

  await prisma.adminUser.update({
    where: { id: userId },
    data: { isActive, updatedById: actor.id },
  });

  await logAudit({
    eventType: AuditEventType.ACCOUNT_EVENT,
    action: isActive ? "USER_ENABLED" : "USER_DISABLED",
    targetUserId: userId,
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteAdminUser(userId: string) {
  const actor = await requireRole(ROLE_GROUPS.SYSTEM_ADMINS);

  if (userId === actor.id) {
    throw new Error("Cannot delete your own account");
  }

  const user = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  if (user.role === "SUPER_ADMIN") {
    const superAdminCount = await prisma.adminUser.count({
      where: { role: "SUPER_ADMIN" },
    });
    if (superAdminCount <= 1) {
      throw new Error("Cannot delete the last SUPER_ADMIN");
    }
  }

  // Nullify foreign key references in audit logs before hard deleting
  await prisma.auditLog.updateMany({
    where: { actorId: userId },
    data: { actorId: null },
  });
  
  await prisma.auditLog.updateMany({
    where: { targetUserId: userId },
    data: { targetUserId: null },
  });

  await prisma.adminUser.delete({
    where: { id: userId },
  });

  await logAudit({
    eventType: AuditEventType.ACCOUNT_EVENT,
    action: "USER_DELETED",
    recordId: userId,
    oldData: { email: user.email, name: user.name, role: user.role },
  });

  revalidatePath("/admin/users");
  return { success: true };
}
