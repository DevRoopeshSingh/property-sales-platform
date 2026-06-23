import { Building2, LayoutDashboard, Home, Users, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Building2 size={20} color="white" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Prop<span className="text-blue-400">Connect</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600/10 text-blue-400 font-medium transition-colors">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/admin/properties" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <Home size={20} />
            Properties
          </Link>
          <Link href="/admin/leads" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <Users size={20} />
            Leads
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <Settings size={20} />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile Header (minimal) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:hidden">
           <div className="font-bold text-lg text-slate-900">PropConnect</div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
