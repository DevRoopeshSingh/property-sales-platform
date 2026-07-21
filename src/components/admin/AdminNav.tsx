"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, Users, Settings } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", icon: Home },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav({ isMinimized = false }: { isMinimized?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 py-4 px-3 space-y-2">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        
        return (
          <Link 
            key={href} 
            href={href} 
            title={isMinimized ? label : undefined}
            className={`flex items-center rounded-lg transition-colors ${
              isMinimized ? "justify-center px-0 py-3" : "gap-3 px-4 py-3"
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
    </nav>
  );
}
