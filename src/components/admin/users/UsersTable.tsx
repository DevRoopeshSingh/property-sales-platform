"use client";

import { useState } from "react";
import { AdminRole } from "@prisma/client";
import { toggleAdminStatus, updateAdminRole, deleteAdminUser } from "@/app/admin/users/actions";
import { MoreVertical, Shield, ShieldAlert, ShieldCheck, User, Check, X, ShieldOff, Trash2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import { CreateUserModal } from "./CreateUserModal";

export type UserDTO = {
  id: string;
  email: string;
  name: string | null;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
};

export function UsersTable({ initialUsers }: { initialUsers: UserDTO[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    setIsLoading(userId);
    try {
      const res = await toggleAdminStatus(userId, !currentStatus);
      if (res.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
        toast.success(`User ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update user status");
    } finally {
      setIsLoading(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: AdminRole) => {
    setIsLoading(userId);
    try {
      const res = await updateAdminRole(userId, newRole);
      if (res.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        toast.success("Role updated successfully");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update role");
    } finally {
      setIsLoading(null);
    }
  };

  const RoleIcon = ({ role }: { role: AdminRole }) => {
    switch (role) {
      case "SUPER_ADMIN": return <ShieldAlert className="w-4 h-4 text-purple-600" />;
      case "IT_ADMIN": return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      case "IT_SUPPORT": return <Shield className="w-4 h-4 text-indigo-600" />;
      case "SALES_MANAGER": return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case "SALES_EXECUTIVE": return <Shield className="w-4 h-4 text-emerald-500" />;
      case "MARKETING": return <User className="w-4 h-4 text-pink-600" />;
      case "OPERATIONS": return <User className="w-4 h-4 text-orange-600" />;
      case "ACCOUNTS": return <User className="w-4 h-4 text-yellow-600" />;
      case "SUPPORT": return <User className="w-4 h-4 text-cyan-600" />;
      case "VIEWER": return <ShieldOff className="w-4 h-4 text-slate-500" />;
      default: return <User className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div>
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h2 className="font-semibold text-slate-800">Staff Accounts</h2>
        <CreateUserModal onUserCreated={(newUser) => setUsers([newUser, ...users])} />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{user.name || "Unnamed"}</div>
                      <div className="text-slate-500 text-xs">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <RoleIcon role={user.role} />
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as AdminRole)}
                      disabled={isLoading === user.id}
                      className="bg-transparent border-0 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-100 rounded px-1 py-0.5 focus:ring-0"
                    >
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="IT_ADMIN">IT Admin</option>
                      <option value="IT_SUPPORT">IT Support</option>
                      <option value="SALES_MANAGER">Sales Manager</option>
                      <option value="SALES_EXECUTIVE">Sales Executive</option>
                      <option value="MARKETING">Marketing</option>
                      <option value="OPERATIONS">Operations</option>
                      <option value="ACCOUNTS">Accounts</option>
                      <option value="SUPPORT">Support</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleStatus(user.id, user.isActive)}
                    disabled={isLoading === user.id}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      user.isActive 
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                        : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                    }`}
                  >
                    {user.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {user.isActive ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content align="end" className="bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[160px] z-50">
                        <DropdownMenu.Item 
                          className="px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer outline-none"
                          onClick={async () => {
                            if (window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
                              setIsLoading(user.id);
                              try {
                                const res = await deleteAdminUser(user.id);
                                if (res.success) {
                                  setUsers(users.filter(u => u.id !== user.id));
                                  toast.success("User deleted successfully");
                                }
                              } catch (error: any) {
                                toast.error(error.message || "Failed to delete user");
                              } finally {
                                setIsLoading(null);
                              }
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete User
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </td>
              </tr>
            ))}
            
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
