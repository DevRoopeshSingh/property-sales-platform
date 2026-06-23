import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Edit, Trash2, Home, CheckCircle2, Clock } from "lucide-react";
import { deleteProperty } from "./actions";

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Properties</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage your property listings</p>
        </div>
        <Link href="/admin/properties/new" className="btn btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add Property
        </Link>
      </div>

      <div className="card overflow-hidden">
        {properties.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[var(--color-surface-2)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="text-[var(--color-text-muted)]" size={32} />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">No properties found</h3>
            <p className="text-[var(--color-text-secondary)] mt-2 mb-6">
              You haven't added any properties yet. Create your first listing to get started.
            </p>
            <Link href="/admin/properties/new" className="btn btn-primary">
              Create Property
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] text-sm border-b border-[var(--color-border)]">
                  <th className="p-4 font-medium">Property</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-[var(--color-border)] overflow-hidden flex-shrink-0">
                          {property.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              src={property.images[0].url} 
                              alt={property.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                              <Home size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--color-text-primary)] line-clamp-1">{property.title}</p>
                          <p className="text-xs text-[var(--color-text-secondary)] mt-1">{property.locality}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                      {property.type} <br/>
                      <span className="text-xs opacity-75">{property.subType}</span>
                    </td>
                    <td className="p-4 text-sm font-medium text-[var(--color-text-primary)]">
                      ₹ {property.priceLabel}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        property.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                        property.status === "DRAFT" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {property.status === "ACTIVE" ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                        {property.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/properties/${property.id}/edit`}
                          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-brand-600)] hover:bg-[var(--color-brand-50)] rounded-md transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
                        <form action={async () => {
                          "use server";
                          await deleteProperty(property.id);
                        }}>
                          <button 
                            type="submit"
                            className="p-2 text-[var(--color-text-secondary)] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            onClick={(e) => {
                              if(!confirm("Are you sure you want to delete this property?")) e.preventDefault();
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
