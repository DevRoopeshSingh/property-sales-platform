import SettingsClient from "./SettingsClient";
import { getSettings } from "./actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  let initialSettings;
  try {
    initialSettings = await getSettings();
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">403 - Forbidden</h1>
          <p className="text-slate-600">You do not have permission to access the platform settings.</p>
        </div>
      );
    }
    throw error;
  }
  
  return <SettingsClient initialSettings={initialSettings} />;
}
