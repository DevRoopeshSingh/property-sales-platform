"use client";

import { LogOut } from "lucide-react";
import { adminLogout } from "@/app/admin/logout-action";
import { useTransition } from "react";

export function LogoutButton({ isMobile = false }: { isMobile?: boolean }) {
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
      className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-colors disabled:opacity-50"
    >
      <LogOut size={20} />
      {isPending ? "Signing out..." : "Sign Out"}
    </button>
  );
}
