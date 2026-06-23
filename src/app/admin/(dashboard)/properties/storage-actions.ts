"use server";

import { createClient } from "@supabase/supabase-js";

export async function deleteImagesFromStorage(keys: string[]) {
  if (!keys || keys.length === 0) return { success: true };

  // We need the service role key to reliably delete images via server actions
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn("Supabase credentials not found. Skipping image deletion.");
    return { success: false, error: "Storage credentials missing" };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    const { error } = await supabaseAdmin.storage
      .from("properties")
      .remove(keys);

    if (error) {
      console.error("Failed to delete images from Supabase:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error deleting images:", err);
    return { success: false, error: "Unexpected error occurred during image deletion." };
  }
}

export async function uploadImageToStorage(formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    const filePath = formData.get("filePath") as string | null;

    if (!file || !filePath) {
      return { success: false, error: "Missing file or filePath" };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return { success: false, error: "Storage credentials missing" };
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("properties")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("properties")
      .getPublicUrl(filePath);

    return { success: true, publicUrl, key: filePath };
  } catch (err) {
    console.error("Unexpected upload error:", err);
    return { success: false, error: "Unexpected error occurred during upload." };
  }
}
