"use client";

import { LogOut } from "lucide-react";
import { adminLogout } from "@/app/admin/logout-action";
import { useTransition } from "react";

export function LogoutButton({ isMobile = false, isMinimized = false }: { isMobile?: boolean; isMinimized?: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(() => {
      adminLogout();
    });
  };

  if (isMobile) {
    return (
      <button 
        onClick={handleSignOut} 
        disabled={isPending}
        className="text-sm text-red-600 font-medium disabled:opacity-50"
      >
        {isPending ? "..." : "Sign Out"}
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isPending}
      title={isMinimized ? "Sign Out" : undefined}
      className={`flex w-full items-center rounded-lg hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-colors disabled:opacity-50 ${
        isMinimized ? "justify-center px-0 py-3" : "gap-3 px-4 py-3"
      }`}
    >
      <LogOut size={20} className="shrink-0" />
      {!isMinimized && <span>{isPending ? "Signing out..." : "Sign Out"}</span>}
    </button>
  );
}
