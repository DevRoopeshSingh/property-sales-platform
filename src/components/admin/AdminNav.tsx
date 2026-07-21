"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, Users, Settings, MapPin, UserCog, ShieldAlert } from "lucide-react";
import { AdminRole } from "@prisma/client";
import { hasRole, ROLE_GROUPS } from "@/lib/roles";

type NavGroup = {
  title: string;
  items: { href: string; label: string; icon: any; adminOnly?: boolean }[];
};

const navGroups: NavGroup[] = [
  {
    title: "Operations",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/leads", label: "Leads", icon: Users },
      { href: "/admin/properties", label: "Properties", icon: Home },
    ]
  },
  {
    title: "Management",
    items: [
      { href: "/admin/locations", label: "Locations", icon: MapPin },
      { href: "/admin/users", label: "Staff Users", icon: UserCog, adminOnly: true },
    ]
  },
  {
    title: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: ShieldAlert, adminOnly: true },
    ]
  }
];

export function AdminNav({ isMinimized = false, userRole }: { isMinimized?: boolean, userRole?: AdminRole }) {
  const pathname = usePathname();
  
  const canManageSystem = hasRole(userRole, ROLE_GROUPS.SYSTEM_ADMINS);

  return (
    <nav className="flex-1 py-2 px-3">
      {navGroups.map((group, groupIndex) => {
        const visibleItems = group.items.filter(item => !item.adminOnly || canManageSystem);
        
        if (visibleItems.length === 0) return null;

        return (
          <div key={group.title} className={groupIndex !== 0 ? "mt-6" : ""}>
            {!isMinimized && (
              <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {group.title}
              </div>
            )}
            
            <div className="space-y-1">
              {visibleItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                
                return (
                  <Link 
                    key={href} 
                    href={href} 
                    title={isMinimized ? label : undefined}
                    className={`flex items-center rounded-lg transition-colors ${
                      isMinimized ? "justify-center px-0 py-3" : "gap-3 px-4 py-2.5"
                    } ${
                      isActive 
                        ? "bg-blue-600/10 text-blue-400 font-medium" 
                        : "hover:bg-slate-800 text-slate-300 hover:text-white"
                    }`}
                  >
                    <Icon size={20} className="shrink-0" />
                    {!isMinimized && <span>{label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
