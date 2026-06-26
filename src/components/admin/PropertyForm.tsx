"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { propertySchema, PropertyFormValues } from "@/lib/validations/property";
import { LOCALITY_LABELS } from "@/types";
import { createProperty, updateProperty } from "@/app/admin/(dashboard)/properties/actions";
import { ImageUploader } from "./ImageUploader";

interface PropertyFormProps {
  initialData?: Record<string, unknown>; // The property data if editing
  propertyId?: string;
}

const defaultValues: Partial<PropertyFormValues> = {
  status: "DRAFT",
  type: "RESIDENTIAL",
  subType: "APARTMENT",
  featured: false,
  priceNegotiable: false,
  possession: "READY_TO_MOVE",
  locality: "MUMBAI",
  isDistressed: false,
  duesPending: "",
  amenities: [],
  images: [],
};

export function PropertyForm({ initialData, propertyId }: PropertyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // If initialData is provided, map its properties (like BigInt -> Number) 
  // to match the form values structure.
  const mappedInitialData = initialData ? {
    ...initialData,
    price: Number(initialData.price),
  } : defaultValues;



  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(propertySchema) as any,
    defaultValues: mappedInitialData,
  });

  const currentType = watch("type");
  const currentSubType = watch("subType");
  const isCommercial = currentType === "COMMERCIAL" || currentSubType === "OFFICE" || currentSubType === "SHOP" || currentSubType === "SHOWROOM";


  const onSubmit = async (data: PropertyFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = propertyId 
        ? await updateProperty(propertyId, data)
        : await createProperty(data);

      if (!result.success) {
        setServerError(result.error || "Something went wrong.");
        toast.error(result.error || "Failed to save property");
      } else {
        toast.success(propertyId ? "Property updated successfully!" : "Property created successfully!");
        router.push("/admin/properties");
        router.refresh();
      }
    } catch {
      setServerError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {serverError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {serverError}
        </div>
      )}

      {/* 1. Basic Information */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 border-b border-[var(--color-border)] pb-2">
          1. Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Property Title *</label>
            <input 
              {...register("title")} 
              placeholder="e.g. Luxury 3BHK in Hiranandani Estate"
              className="input w-full" 
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Description *</label>
            <textarea 
              {...register("description")} 
              rows={5}
              placeholder="Detailed description of the property..."
              className="input w-full resize-y" 
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Property Type *</label>
            <select {...register("type")} className="input w-full">
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Sub Type *</label>
            <select {...register("subType")} className="input w-full">
              <optgroup label="Residential">
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="INDEPENDENT_HOUSE">Independent House</option>
                <option value="ROW_HOUSE">Row House</option>
                <option value="PLOT">Plot</option>
              </optgroup>
              <optgroup label="Commercial">
                <option value="SHOP">Shop</option>
                <option value="OFFICE">Office</option>
                <option value="SHOWROOM">Showroom</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Status</label>
            <select {...register("status")} className="input w-full">
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active (Published)</option>
              <option value="SOLD">Sold</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

            <div className="flex items-center space-x-2 mt-7">
              <input 
                type="checkbox" 
                id="featured" 
                {...register("featured")} 
                className="w-5 h-5 rounded border-gray-300 text-[var(--color-brand-600)] focus:ring-[var(--color-brand-500)]"
              />
              <label htmlFor="featured" className="text-sm font-medium text-[var(--color-text-primary)]">
                Feature this property on the homepage
              </label>
            </div>

            <div className="flex items-center space-x-2 mt-7">
              <input 
                type="checkbox" 
                id="isDistressed" 
                {...register("isDistressed")} 
                className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="isDistressed" className="text-sm font-medium text-red-600">
                Mark as Distressed Property
              </label>
            </div>
          </div>
        </div>

      {/* 2. Pricing & Specs */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 border-b border-[var(--color-border)] pb-2">
          2. Pricing & Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Price (Absolute) *</label>
            <input 
              type="number" 
              {...register("price")} 
              placeholder="e.g. 15000000"
              className="input w-full" 
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Price Label *</label>
            <input 
              {...register("priceLabel")} 
              placeholder="e.g. 1.5 Cr or 50 Lakhs"
              className="input w-full" 
            />
            {errors.priceLabel && <p className="text-red-500 text-xs mt-1">{errors.priceLabel.message}</p>}
          </div>

          <div className="flex items-center space-x-2 mt-7">
            <input 
              type="checkbox" 
              id="priceNegotiable" 
              {...register("priceNegotiable")} 
              className="w-5 h-5 rounded border-gray-300 text-[var(--color-brand-600)]"
            />
            <label htmlFor="priceNegotiable" className="text-sm font-medium text-[var(--color-text-primary)]">
              Price is Negotiable
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Area (Sq.Ft)</label>
            <input 
              type="number" 
              {...register("area")} 
              placeholder="e.g. 1200"
              className="input w-full" 
            />
            {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Carpet Area (Sq.Ft)</label>
            <input 
              type="number" 
              {...register("carpetArea")} 
              className="input w-full" 
            />
          </div>

          {!isCommercial && (
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">BHK (Bedrooms)</label>
              <input 
                type="number" 
                {...register("bhk")} 
                placeholder="e.g. 3"
                className="input w-full" 
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Floor</label>
            <input 
              type="number" 
              {...register("floor")} 
              placeholder="e.g. 5"
              className="input w-full" 
            />
          </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Total Floors</label>
              <input 
                type="number" 
                {...register("totalFloors")} 
                placeholder="e.g. 15"
                className="input w-full" 
              />
            </div>

            <div className="md:col-span-3 mt-4 border-t border-[var(--color-border)] pt-4">
              <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Dues Pending (Optional)</label>
              <textarea 
                {...register("duesPending")} 
                rows={2}
                placeholder="Details about any pending dues (maintenance, taxes, etc.)..."
                className="input w-full resize-y" 
              />
            </div>
          </div>
        </div>

      {/* 3. Location & Details */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 border-b border-[var(--color-border)] pb-2">
          3. Location & Project Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Locality *</label>
            <select {...register("locality")} className="input w-full">
              {Object.entries(LOCALITY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Project / Building Name</label>
            <input 
              {...register("projectName")} 
              placeholder="e.g. Lodha Bellissimo"
              className="input w-full" 
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Full Address *</label>
            <input 
              {...register("address")} 
              placeholder="e.g. Plot No 12, Sector 15..."
              className="input w-full" 
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Possession Status *</label>
            <select {...register("possession")} className="input w-full">
              <option value="READY_TO_MOVE">Ready to Move</option>
              <option value="UNDER_CONSTRUCTION">Under Construction</option>
              <option value="NEW_LAUNCH">New Launch</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Builder Name</label>
            <input 
              {...register("builderName")} 
              className="input w-full" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">Google Maps URL</label>
            <input 
              type="url"
              {...register("googleMapsUrl")} 
              className="input w-full" 
            />
            {errors.googleMapsUrl && <p className="text-red-500 text-xs mt-1">{errors.googleMapsUrl.message}</p>}
          </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-primary)]">RERA Number</label>
              <input 
                {...register("reraNumber")} 
                className="input w-full" 
              />
            </div>
          </div>
        </div>

        {/* 4. Amenities / Location Advantages */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 border-b border-[var(--color-border)] pb-2">
            4. {isCommercial ? "Location Advantages" : "Amenities"}
          </h2>
          <Controller
            name="amenities"
            control={control}
            render={({ field }) => {
              const AMENITY_OPTIONS = isCommercial 
                ? [
                    "Near Metro", "Highway Access", "Business Hub", "High Footfall", 
                    "Visitor Parking", "Power Backup", "24/7 Security", "Cafeteria / Food Court", 
                    "Washrooms", "Lift", "Fire Safety", "Internet / Broadband"
                  ]
                : [
                    "Gym", "Swimming Pool", "Clubhouse", "24/7 Security", 
                    "Power Backup", "Car Parking", "Children's Play Area", 
                    "Jogging Track", "Intercom", "Lift", "Vaastu Compliant", 
                    "Rain Water Harvesting", "Gas Pipeline", "Park"
                  ];
              
              const toggleAmenity = (amenity: string) => {
                const current = field.value || [];
                const updated = current.includes(amenity)
                  ? current.filter(a => a !== amenity)
                  : [...current, amenity];
                field.onChange(updated);
              };

              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {AMENITY_OPTIONS.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-slate-50 rounded">
                      <input 
                        type="checkbox" 
                        checked={(field.value || []).includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 rounded border-gray-300 text-[var(--color-brand-600)]"
                      />
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">{amenity}</span>
                    </label>
                  ))}
                </div>
              );
            }}
          />
        </div>

        {/* 5. Media & Uploads */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 border-b border-[var(--color-border)] pb-2">
            5. Media (Images)
          </h2>
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <ImageUploader 
              value={field.value} 
              onChange={field.onChange} 
              maxImages={15} 
            />
          )}
        />
        {errors.images && <p className="text-red-500 text-xs mt-2">{errors.images.message}</p>}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4 border-t border-[var(--color-border)] pt-6">
        <button
          type="button"
          onClick={() => router.push("/admin/properties")}
          className="btn btn-outline"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary min-w-[150px] flex justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (propertyId ? "Update Property" : "Save Property")}
        </button>
      </div>
    </form>
  );
}
