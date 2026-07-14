"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signOut } from "@/auth";

export async function adminLogout() {
  try {
    const cookieStore = await cookies();
    const cookieNames = cookieStore.getAll().map(c => c.name);
    
    // Manually forcefully clear any auth cookies to bypass domain/path issues
    for (const name of cookieNames) {
      if (name.includes("authjs") || name.includes("next-auth")) {
        cookieStore.delete(name);
      }
    }

    // Attempt to run NextAuth's signOut just in case it handles other state,
    // but tell it not to redirect so we can control the flow.
    await signOut({ redirect: false });
  } catch (error: unknown) {
    // Re-throw redirect errors — Next.js uses thrown errors to implement redirect()
    if (isRedirectError(error)) throw error;
    // Log real errors instead of silently swallowing them
    console.error("Logout error:", error);
  }

  // Forcefully redirect the user back to the login page
  redirect("/admin/login");
}

