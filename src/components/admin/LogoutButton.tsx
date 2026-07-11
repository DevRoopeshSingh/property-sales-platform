"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton({ isMobile = false }: { isMobile?: boolean }) {
  const handleSignOut = () => {
    // Client-side signOut safely clears session and redirects
    signOut({ callbackUrl: "/admin/login" });
  };

  if (isMobile) {
    return (
      <button 
        onClick={handleSignOut} 
        className="text-sm text-red-600 font-medium"
      >
        Sign Out
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-colors"
    >
      <LogOut size={20} />
      Sign Out
    </button>
  );
}
