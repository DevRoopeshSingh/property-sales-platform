import type { Metadata } from "next";
import SavedPropertiesClient from "@/components/public/SavedPropertiesClient";

export const metadata: Metadata = {
  title: "Saved Properties | PropConnect",
  description: "View your saved and shortlisted properties on PropConnect.",
};

export default function SavedPropertiesPage() {
  return (
    <div className="bg-[var(--color-surface-2)] min-h-screen py-10">
      <div className="container-main">
        <SavedPropertiesClient />
      </div>
    </div>
  );
}
