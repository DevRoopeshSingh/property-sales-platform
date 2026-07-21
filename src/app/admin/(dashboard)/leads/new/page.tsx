import AddLeadForm from "./AddLeadForm";
import { Users } from "lucide-react";
import { requireRole, ROLE_GROUPS } from "@/lib/permissions";

export const metadata = {
  title: "Add New Lead - Admin",
};

export default async function AddLeadPage() {
  await requireRole(ROLE_GROUPS.LEAD_MANAGERS);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Lead</h1>
          <p className="text-sm text-slate-500 mt-1">Manually enter a customer inquiry</p>
        </div>
      </div>
      
      <AddLeadForm />
    </div>
  );
}
