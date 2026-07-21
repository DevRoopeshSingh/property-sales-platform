import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Home, AlertCircle, TrendingUp, ChevronRight, AlertTriangle, Activity } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();

  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);

  const [
    unassignedLeads,
    propertiesPending,
    activeProperties,
    recentLeads,
    recentProperties,
    staleLeadsCount,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.property.count({ where: { status: "DRAFT" } }),
    prisma.property.count({ where: { status: "ACTIVE" } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        priceLabel: true,
        createdAt: true,
      },
    }),
    prisma.lead.count({
      where: {
        status: "NEW",
        createdAt: {
          lt: yesterday,
        },
      },
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { actor: true },
    }),
  ]);

  const hasAlerts = staleLeadsCount > 0 || propertiesPending > 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 text-sm">Welcome back, {session?.user?.name || "Admin"}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/properties/new"
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            Add Property
          </Link>
          <Link
            href="/admin/leads/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Users className="w-4 h-4" />
            Add Lead
          </Link>
        </div>
      </div>

      {/* Dynamic Alerts Banner */}
      {hasAlerts && (
        <div className="flex flex-col gap-3">
          {staleLeadsCount > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Stale Leads Need Attention</h4>
                <p className="text-sm text-red-700 mt-1">
                  You have {staleLeadsCount} unassigned lead{staleLeadsCount !== 1 ? 's' : ''} older than 24 hours.
                </p>
              </div>
              <Link href="/admin/leads" className="ml-auto text-sm font-medium text-red-700 hover:text-red-800 underline">
                View Leads
              </Link>
            </div>
          )}
          {propertiesPending > 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Properties Pending Review</h4>
                <p className="text-sm text-amber-700 mt-1">
                  There {propertiesPending !== 1 ? 'are' : 'is'} {propertiesPending} propert{propertiesPending !== 1 ? 'ies' : 'y'} waiting to be reviewed and activated.
                </p>
              </div>
              <Link href="/admin/properties" className="ml-auto text-sm font-medium text-amber-700 hover:text-amber-800 underline">
                View Properties
              </Link>
            </div>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-slate-500">Unassigned Leads</h3>
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{unassignedLeads}</p>
          <p className="text-xs text-slate-500 mt-2">Requires immediate action</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-slate-500">Pending Review</h3>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{propertiesPending}</p>
          <p className="text-xs text-slate-500 mt-2">Draft properties waiting for approval</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-slate-500">Active Properties</h3>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{activeProperties}</p>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Live on platform
          </p>
        </div>
      </div>

      {/* Split View Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-semibold text-slate-800">Recent Leads</h3>
            <Link href="/admin/leads" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentLeads.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">No recent leads found.</div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="p-4 px-5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-2">
                  <div className="overflow-hidden min-w-0">
                    <p className="font-medium text-slate-900 truncate">{lead.name}</p>
                    <p className="text-sm text-slate-500 truncate mt-1">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-full ${lead.status === 'NEW' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
                    {lead.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-semibold text-slate-800">New Properties</h3>
            <Link href="/admin/properties" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentProperties.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">No properties found.</div>
            ) : (
              recentProperties.map((property) => (
                <div key={property.id} className="p-4 px-5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-2">
                  <div className="overflow-hidden min-w-0">
                    <p className="font-medium text-slate-900 truncate">{property.title}</p>
                    <p className="text-sm text-slate-500 truncate mt-1">
                      {property.priceLabel || 'Price on request'}
                    </p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-full ${
                    property.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                    property.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' : 
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {property.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity (Audit Logs) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-500" /> Activity Feed
            </h3>
            <Link href="/admin/audit-logs" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentAuditLogs.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">No recent activity found.</div>
            ) : (
              recentAuditLogs.map((log) => (
                <div key={log.id} className="p-4 px-5 hover:bg-slate-50 transition-colors flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                      {log.actor?.name?.charAt(0)?.toUpperCase() || 'S'}
                    </div>
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <p className="text-sm text-slate-900 truncate">
                      <span className="font-medium">{log.actor?.name || 'System'}</span> {log.action}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
