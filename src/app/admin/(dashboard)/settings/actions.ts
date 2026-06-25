"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  return getPublicSettings();
}

export async function getPublicSettings() {
  const settings = await prisma.setting.findMany();
  
  // Convert array of {key, value} to a key-value object
  return settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
}

export async function saveSettings(data: Record<string, string>) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    // Upsert all settings in a transaction
    const queries = Object.entries(data).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );

    await prisma.$transaction(queries);
    
    // Revalidate the entire admin layout to ensure any settings used globally are updated
    revalidatePath("/admin", "layout");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to save settings:", error);
    return { success: false, error: "Failed to save settings" };
  }
}
