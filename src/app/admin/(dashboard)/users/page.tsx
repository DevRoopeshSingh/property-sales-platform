import { requireRole, ROLE_GROUPS } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management | Admin",
};

export default async function UsersPage() {
  // Only SUPER_ADMIN can view this page
  await requireRole(ROLE_GROUPS.SYSTEM_ADMINS);

  const users = await prisma.adminUser.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-2">Manage staff accounts, roles, and access permissions.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <UsersTable initialUsers={users} />
      </div>
    </div>
  );
}
