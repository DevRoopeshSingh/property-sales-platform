"use server";

import { prisma } from "@/lib/prisma";
import { propertySchema, PropertyFormValues } from "@/lib/validations/property";
import { revalidatePath } from "next/cache";
import { deleteImagesFromStorage } from "./storage-actions";
import { auth } from "@/auth";

/**
 * Immediately deletes a single image from both the DB and Supabase storage.
 * Called from the ImageUploader "Remove" button so deletions persist without
 * requiring the user to also submit the full property form.
 */
export async function deletePropertyImage(imageId: string, storageKey: string) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    // 1. Delete from database
    const deleted = await prisma.propertyImage.delete({
      where: { id: imageId },
      select: { propertyId: true, property: { select: { slug: true } } },
    });

    // 2. Delete from Supabase storage
    await deleteImagesFromStorage([storageKey]);

    // 3. Revalidate affected pages so Next.js cache is cleared
    revalidatePath(`/admin/properties/${deleted.propertyId}/edit`);
    revalidatePath(`/properties/${deleted.property.slug}`);
    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete property image:", error);
    return { success: false, error: "Failed to delete image." };
  }
}

// Generate a URL-friendly slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-6);
}

export async function createProperty(data: PropertyFormValues) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const validatedData = propertySchema.parse(data);

    const slug = generateSlug(validatedData.title);

    const property = await prisma.property.create({
      data: {
        title: validatedData.title,
        slug,
        description: validatedData.description,
        type: validatedData.type,
        subType: validatedData.subType,
        status: validatedData.status,
        featured: validatedData.featured,
        isDistressed: validatedData.isDistressed,
        duesPending: validatedData.duesPending,
        
        price: BigInt(validatedData.price),
        priceLabel: validatedData.priceLabel,
        priceNegotiable: validatedData.priceNegotiable,
        
        bhk: validatedData.bhk,
        area: validatedData.area,
        carpetArea: validatedData.carpetArea,
        floor: validatedData.floor,
        totalFloors: validatedData.totalFloors,
        
        locality: validatedData.locality,
        address: validatedData.address,
        landmark: validatedData.landmark,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        googleMapsUrl: validatedData.googleMapsUrl,
        
        possession: validatedData.possession,
        possessionDate: validatedData.possessionDate,
        reraNumber: validatedData.reraNumber,
        projectName: validatedData.projectName,
        builderName: validatedData.builderName,
        
        amenities: validatedData.amenities,
        
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,

        images: {
          create: validatedData.images.map((img, index) => ({
            url: img.url,
            key: img.key,
            altText: img.altText || validatedData.title,
            isPrimary: img.isPrimary,
            order: index,
          })),
        },
      },
    });

    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath("/");

    return { success: true, propertyId: property.id };
  } catch (error) {
    console.error("Failed to create property:", error);
    return { success: false, error: "Failed to create property. Please check the inputs." };
  }
}

export async function updateProperty(id: string, data: PropertyFormValues) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const validatedData = propertySchema.parse(data);

    // Find existing images to compare
    const existingImages = await prisma.propertyImage.findMany({
      where: { propertyId: id }
    });
    const existingKeys = existingImages.map(img => img.key);
    const newKeys = validatedData.images.map(img => img.key);
    const keysToDelete = existingKeys.filter(key => !newKeys.includes(key));

    // Delete removed images from Supabase storage
    if (keysToDelete.length > 0) {
      await deleteImagesFromStorage(keysToDelete);
    }

    // Delete existing images from DB and recreate them (simplest approach for full sync)
    await prisma.propertyImage.deleteMany({
      where: { propertyId: id },
    });

    const property = await prisma.property.update({
      where: { id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        subType: validatedData.subType,
        status: validatedData.status,
        featured: validatedData.featured,
        isDistressed: validatedData.isDistressed,
        duesPending: validatedData.duesPending,
        
        price: BigInt(validatedData.price),
        priceLabel: validatedData.priceLabel,
        priceNegotiable: validatedData.priceNegotiable,
        
        bhk: validatedData.bhk,
        area: validatedData.area,
        carpetArea: validatedData.carpetArea,
        floor: validatedData.floor,
        totalFloors: validatedData.totalFloors,
        
        locality: validatedData.locality,
        address: validatedData.address,
        landmark: validatedData.landmark,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        googleMapsUrl: validatedData.googleMapsUrl,
        
        possession: validatedData.possession,
        possessionDate: validatedData.possessionDate,
        reraNumber: validatedData.reraNumber,
        projectName: validatedData.projectName,
        builderName: validatedData.builderName,
        
        amenities: validatedData.amenities,
        
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,

        images: {
          create: validatedData.images.map((img, index) => ({
            url: img.url,
            key: img.key,
            altText: img.altText || validatedData.title,
            isPrimary: img.isPrimary,
            order: index,
          })),
        },
      },
    });

    revalidatePath("/admin/properties");
    revalidatePath(`/admin/properties/${id}/edit`);
    revalidatePath("/properties");
    revalidatePath(`/properties/${property.slug}`);
    revalidatePath("/");

    return { success: true, propertyId: property.id };
  } catch (error) {
    console.error("Failed to update property:", error);
    return { success: false, error: "Failed to update property. Please check the inputs." };
  }
}

export async function deleteProperty(id: string) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    // Find existing images to delete from storage
    const existingImages = await prisma.propertyImage.findMany({
      where: { propertyId: id }
    });
    const keysToDelete = existingImages.map(img => img.key);
    
    if (keysToDelete.length > 0) {
      await deleteImagesFromStorage(keysToDelete);
    }

    await prisma.property.delete({
      where: { id },
    });
    
    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete property:", error);
    return { success: false, error: "Failed to delete property." };
  }
}
