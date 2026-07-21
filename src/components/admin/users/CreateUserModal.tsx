"use client";

import { useState } from "react";
import { AdminRole } from "@prisma/client";
import { createAdminUser } from "@/app/admin/users/actions";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UserDTO } from "./UsersTable";

export function CreateUserModal({ onUserCreated }: { onUserCreated: (user: UserDTO) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [passwordMode, setPasswordMode] = useState<"auto" | "manual">("auto");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTempPassword(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as AdminRole;
    const password = passwordMode === "manual" ? (formData.get("password") as string) : undefined;
    const forcePasswordChange = formData.get("forcePasswordChange") === "on";

    try {
      const res = await createAdminUser({ email, name, role, password, forcePasswordChange });
      if (res.success) {
        toast.success("User created successfully!");
        if (res.tempPassword) {
          setTempPassword(res.tempPassword);
        } else {
          setIsOpen(false);
        }
        // Add fake minimal object to UI (page reload usually happens via Next revalidatePath, but doing it optimistic here)
        onUserCreated({
          id: Math.random().toString(), // temporary fake ID until refresh
          email,
          name,
          role,
          isActive: true,
          lastLoginAt: null,
          createdAt: new Date(),
        });
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Invite User
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-lg text-slate-900">Invite New User</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {tempPassword ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-emerald-800 mb-2">User Created Successfully!</h4>
                  <p className="text-emerald-700 text-sm mb-4">Please share this temporary password securely with the user. They will be forced to change it on their first login.</p>
                  <div className="bg-white px-3 py-2 rounded border border-emerald-200 font-mono text-center text-lg tracking-wider text-emerald-900">
                    {tempPassword}
                  </div>
                  <button 
                    onClick={() => {
                      setIsOpen(false);
                      setTempPassword(null);
                    }}
                    className="mt-4 w-full bg-emerald-600 text-white py-2 rounded font-medium text-sm hover:bg-emerald-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900" 
                      placeholder="jane@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900" 
                      placeholder="Jane Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <select 
                      name="role"
                      defaultValue="VIEWER"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                    >
                      <option value="VIEWER">Viewer (Read-only)</option>
                      <option value="SUPPORT">Support</option>
                      <option value="SALES_EXECUTIVE">Sales Executive</option>
                      <option value="SALES_MANAGER">Sales Manager</option>
                      <option value="MARKETING">Marketing</option>
                      <option value="OPERATIONS">Operations</option>
                      <option value="ACCOUNTS">Accounts</option>
                      <option value="IT_SUPPORT">IT Support</option>
                      <option value="IT_ADMIN">IT Admin</option>
                      <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <div className="flex items-center gap-4 mb-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="radio" name="passwordMode" checked={passwordMode === "auto"} onChange={() => setPasswordMode("auto")} className="text-slate-900 focus:ring-slate-900" />
                        Auto-generate
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="radio" name="passwordMode" checked={passwordMode === "manual"} onChange={() => setPasswordMode("manual")} className="text-slate-900 focus:ring-slate-900" />
                        Manual
                      </label>
                    </div>
                    {passwordMode === "manual" && (
                      <input 
                        type="password" 
                        name="password" 
                        required 
                        minLength={6}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900" 
                        placeholder="Enter password"
                      />
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="checkbox" name="forcePasswordChange" defaultChecked className="text-slate-900 focus:ring-slate-900 rounded" />
                      Force password change on first login
                    </label>
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsOpen(false)}
                      className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Create User
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
