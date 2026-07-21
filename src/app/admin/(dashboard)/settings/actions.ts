"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, ROLE_GROUPS } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { unstable_cache } from "next/cache";

export async function getSettings() {
  await requireRole(ROLE_GROUPS.CONFIG_MANAGERS);

  return getPublicSettings();
}

export const getPublicSettings = unstable_cache(
  async () => {
    const settings = await prisma.setting.findMany();
    
    // Convert array of {key, value} to a key-value object
    return settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  },
  ["global-settings"], // Cache Key
  { tags: ["settings"] } // Cache Tag for revalidation
);

export async function saveSettings(data: Record<string, string>) {
  await requireRole(ROLE_GROUPS.CONFIG_MANAGERS);

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
    
    // Revalidate the public site layout to grab fresh settings
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to save settings:", error);
    return { success: false, error: "Failed to save settings" };
  }
}
