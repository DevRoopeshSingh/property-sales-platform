import { Metadata } from "next";
import LocationsManager from "@/components/admin/LocationsManager";
import { getLocationTree } from "@/lib/data/locations";

export const metadata: Metadata = {
  title: "Location Management | Admin Dashboard",
  description: "Manage states, cities, and localities for property listings.",
};

export default async function AdminLocationsPage() {
  const tree = await getLocationTree();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <LocationsManager initialTree={tree} />
    </div>
  );
}
