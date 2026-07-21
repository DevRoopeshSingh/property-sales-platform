import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { getLocationTree } from "@/lib/data/locations";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!property) {
    notFound();
  }

  // Convert BigInt to string/number safely for client component
  const safeProperty = {
    ...property,
    price: property.price.toString(),
    locationId: property.locationId || "",
  };

  const locationTree = await getLocationTree();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Edit Property</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Update property information.</p>
      </div>

      <PropertyForm initialData={safeProperty} propertyId={property.id} locationTree={locationTree} />
    </div>
  );
}
