import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await auth();

  const [totalProperties, activeLeads] = await Promise.all([
    prisma.property.count(),
    prisma.lead.count({
      where: {
        status: {
          notIn: ["CONVERTED", "LOST"],
        },
      },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Welcome back, {session?.user?.name || "Admin"}!</h2>
        <p className="text-slate-600">
          Here is an overview of your property platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Total Properties</h3>
          <p className="text-3xl font-bold text-slate-900">{totalProperties}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Active Leads</h3>
          <p className="text-3xl font-bold text-slate-900">{activeLeads}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Views this month</h3>
          <p className="text-3xl font-bold text-slate-900">-</p>
          <p className="text-xs text-slate-400 mt-1">Analytics coming soon</p>
        </div>
      </div>
    </div>
  );
}
