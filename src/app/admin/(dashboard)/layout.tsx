import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
