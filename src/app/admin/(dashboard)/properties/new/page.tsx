import { PropertyForm } from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Add New Property</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Create a new property listing.</p>
      </div>

      <PropertyForm />
    </div>
  );
}
