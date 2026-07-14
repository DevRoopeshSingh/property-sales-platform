import { WifiOff } from "lucide-react";
import Link from "next/link";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { getPublicSettings } from "@/app/admin/(dashboard)/settings/actions";

export const metadata = {
  title: "You are offline",
};

export default async function OfflinePage() {
  const settings = await getPublicSettings().catch(() => ({} as Record<string, string>));
  const waLink = generateWhatsAppLink({
    source: "offline-page",
    settings,
  });

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
        <WifiOff size={36} />
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-3">
        You are offline
      </h1>
      <p className="text-slate-600 mb-8 max-w-md">
        It looks like you&apos;ve lost your internet connection. 
        PropConnect needs an active connection to browse properties.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link href="/" className="btn btn-primary">
          Try Again
        </Link>
        <a 
          href={waLink}
          className="btn btn-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact on WhatsApp
        </a>
      </div>
      <p className="text-xs text-slate-500 mt-6">
        WhatsApp messages will send automatically when you&apos;re back online.
      </p>
    </div>
  );
}
