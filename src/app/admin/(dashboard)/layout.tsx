import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { auth } from "@/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return <AdminLayoutShell userRole={session?.user?.role}>{children}</AdminLayoutShell>;
}
