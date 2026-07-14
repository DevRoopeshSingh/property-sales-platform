"use server";

import { prisma } from "@/lib/prisma";

export async function getPropertiesByIds(ids: string[]) {
  if (!ids || ids.length === 0) return [];

  try {
    const properties = await prisma.property.findMany({
      where: {
        id: { in: ids },
        status: { in: ["ACTIVE", "SOLD", "RENTED"] }, // Only fetch active/sold properties, not drafts
      },
      include: {
        images: {
          orderBy: { order: "asc" },
          take: 1, // Only need the primary image for the card
        },
      },
    });

    // We need to return them in the same format as PropertyCard expects
    return properties.map((p) => ({
      ...p,
      price: Number(p.price),
    }));
  } catch (error) {
    console.error("Failed to fetch saved properties:", error);
    return [];
  }
}
