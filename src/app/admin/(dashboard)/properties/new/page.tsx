import { PropertyForm } from "@/components/admin/PropertyForm";
import { getLocationTree } from "@/lib/data/locations";

export default async function NewPropertyPage() {
  const locationTree = await getLocationTree();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Add New Property</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Create a new property listing.</p>
      </div>

      <PropertyForm locationTree={locationTree} />
    </div>
  );
}
