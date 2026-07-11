import { LogOut } from "lucide-react";
import { signOut } from "@/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { MobileSidebarToggle } from "@/components/admin/MobileSidebarToggle";
import { AutoLogout } from "@/components/admin/AutoLogout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AutoLogout timeoutMinutes={15} />
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">

            <span className="font-bold text-xl tracking-tight">
              Prop<span className="text-blue-400">Connect</span>
            </span>
          </div>
        </div>

        <AdminNav />

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
           <div className="flex items-center gap-3">
             <MobileSidebarToggle />
             <div className="font-bold text-lg text-slate-900">PropConnect</div>
           </div>
           <form
             action={async () => {
               "use server";
               await signOut({ redirectTo: "/admin/login" });
             }}
           >
             <button type="submit" className="text-sm text-red-600 font-medium">
               Sign Out
             </button>
           </form>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
