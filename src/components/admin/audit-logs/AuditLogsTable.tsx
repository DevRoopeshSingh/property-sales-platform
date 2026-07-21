"use client";

import { useState } from "react";
import { AuditEventType } from "@prisma/client";
import { Filter, Search, User, Key, Database, Activity, Eye } from "lucide-react";

type AuditLogDTO = {
  id: string;
  eventType: AuditEventType;
  action: string;
  tableName: string | null;
  createdAt: Date;
  actor: { name: string | null; email: string } | null;
  targetUser: { name: string | null; email: string } | null;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
};

export function AuditLogsTable({ initialLogs }: { initialLogs: AuditLogDTO[] }) {
  const [logs] = useState(initialLogs);
  const [selectedLog, setSelectedLog] = useState<AuditLogDTO | null>(null);

  const getEventIcon = (type: AuditEventType) => {
    switch (type) {
      case "AUTH_EVENT": return <Key className="w-4 h-4 text-amber-500" />;
      case "DATA_MUTATION": return <Database className="w-4 h-4 text-blue-500" />;
      case "ACCOUNT_EVENT": return <User className="w-4 h-4 text-purple-500" />;
      case "SYSTEM_EVENT": return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div>
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 w-64"
            />
          </div>
          <button className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">Timestamp</th>
              <th className="px-6 py-4 font-medium">Actor</th>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium">Target / Module</th>
              <th className="px-6 py-4 font-medium text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {log.actor ? (
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{log.actor.name || "System"}</span>
                      <span className="text-xs text-slate-500">{log.actor.email}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">System Auto</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getEventIcon(log.eventType)}
                    <span className="font-medium text-slate-700">{log.action}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {log.targetUser ? (
                    <span>User: {log.targetUser.email}</span>
                  ) : log.tableName ? (
                    <span>Table: {log.tableName}</span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {(log.oldData || log.newData) && (
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="text-indigo-600 hover:text-indigo-800 p-1 bg-indigo-50 rounded inline-flex items-center gap-1 text-xs font-medium px-2 py-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
            
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedLog(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                {getEventIcon(selectedLog.eventType)}
                {selectedLog.action}
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-50/50">
              <div className="grid grid-cols-2 gap-4">
                {selectedLog.oldData && (
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Previous Data</h4>
                    <pre className="text-xs text-rose-700 bg-rose-50 p-3 rounded overflow-x-auto">
                      {JSON.stringify(selectedLog.oldData, null, 2)}
                    </pre>
                  </div>
                )}
                {selectedLog.newData && (
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">New Data</h4>
                    <pre className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded overflow-x-auto">
                      {JSON.stringify(selectedLog.newData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
