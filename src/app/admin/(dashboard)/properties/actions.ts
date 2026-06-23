"use server";

import { prisma } from "@/lib/prisma";
import { propertySchema, PropertyFormValues } from "@/lib/validations/property";
import { revalidatePath } from "next/cache";
import { deleteImagesFromStorage } from "./storage-actions";

// Generate a URL-friendly slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-6);
}

export async function createProperty(data: PropertyFormValues) {
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

    return { success: true, propertyId: property.id };
  } catch (error) {
    console.error("Failed to create property:", error);
    return { success: false, error: "Failed to create property. Please check the inputs." };
  }
}

export async function updateProperty(id: string, data: PropertyFormValues) {
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

    return { success: true, propertyId: property.id };
  } catch (error) {
    console.error("Failed to update property:", error);
    return { success: false, error: "Failed to update property. Please check the inputs." };
  }
}

export async function deleteProperty(id: string) {
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
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete property:", error);
    return { success: false, error: "Failed to delete property." };
  }
}
