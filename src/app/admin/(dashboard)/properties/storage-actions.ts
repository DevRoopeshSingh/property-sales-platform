"use server";

import { createClient } from "@supabase/supabase-js";

// We need the service role key to reliably delete images via server actions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function deleteImagesFromStorage(keys: string[]) {
  if (!keys || keys.length === 0) return { success: true };

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
