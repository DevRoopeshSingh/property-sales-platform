"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

export async function addState(name: string) {
  await requireAuth();
  const slug = generateSlug(name);
  if (!slug) throw new Error("Invalid name");

  try {
    const state = await prisma.state.create({
      data: { name, slug }
    });
    revalidatePath("/admin/locations");
    return { success: true, data: state };
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "State with this name or slug already exists." };
    return { error: "Failed to add state." };
  }
}

export async function addCity(stateId: string, name: string) {
  await requireAuth();
  const slug = generateSlug(name);
  if (!slug) throw new Error("Invalid name");

  try {
    const city = await prisma.city.create({
      data: { name, slug, stateId }
    });
    revalidatePath("/admin/locations");
    return { success: true, data: city };
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "City already exists in this state." };
    return { error: "Failed to add city." };
  }
}

export async function addLocality(cityId: string, name: string) {
  await requireAuth();
  const slug = generateSlug(name);
  if (!slug) throw new Error("Invalid name");

  try {
    const locality = await prisma.locationNode.create({
      data: { name, slug, cityId }
    });
    revalidatePath("/admin/locations");
    return { success: true, data: locality };
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "Locality already exists in this city." };
    return { error: "Failed to add locality." };
  }
}

export async function deleteLocation(type: 'state' | 'city' | 'locality', id: string) {
  await requireAuth();

  try {
    if (type === 'state') {
      await prisma.state.delete({ where: { id } });
    } else if (type === 'city') {
      await prisma.city.delete({ where: { id } });
    } else if (type === 'locality') {
      await prisma.locationNode.delete({ where: { id } });
    }
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2003') {
      return { error: "Cannot delete this location because it is currently in use (has associated cities, localities, or properties)." };
    }
    return { error: `Failed to delete ${type}.` };
  }
}
