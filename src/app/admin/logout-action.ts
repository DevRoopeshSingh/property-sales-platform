"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
  } catch (error: any) {
    // NextAuth signOut often throws NEXT_REDIRECT internally even if redirect: false is passed in some betas
    // We catch it and ignore it so we can run our guaranteed redirect below.
    if (error.message === "NEXT_REDIRECT") {
      // ignore
    }
  }

  // Forcefully redirect the user back to the login page
  redirect("/admin/login");
}
