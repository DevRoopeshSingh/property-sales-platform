"use client";

import { useState } from "react";
import { saveSettings } from "./actions";
import { Save, Settings, MessageSquare, LayoutDashboard, Globe, CheckCircle } from "lucide-react";

const TABS = [
  { id: "general", label: "General", icon: <Settings size={18} /> },
  { id: "leads", label: "Lead Management", icon: <MessageSquare size={18} /> },
  { id: "property", label: "Property Rules", icon: <LayoutDashboard size={18} /> },
  { id: "seo", label: "SEO Defaults", icon: <Globe size={18} /> },
];

export default function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<Record<string, string>>({
    // Defaults to prevent undefined controlled inputs
    siteName: initialSettings.siteName || "PropConnect",
    supportEmail: initialSettings.supportEmail || "enquiry@thepropconnect.in",
    supportPhone: initialSettings.supportPhone || "+91 98333 78400",
    defaultCity: initialSettings.defaultCity || "MUMBAI",
    
    waNumber: initialSettings.waNumber || "919833378400",
    waDefaultMsg: initialSettings.waDefaultMsg || "Hi, I am interested in property listings.",
    leadFollowUpHours: initialSettings.leadFollowUpHours || "24",
    
    featuredLimit: initialSettings.featuredLimit || "6",
    autoApproveProperties: initialSettings.autoApproveProperties || "false",
    
    seoDefaultTitleSuffix: initialSettings.seoDefaultTitleSuffix || " | PropConnect",
    seoDefaultDescription: initialSettings.seoDefaultDescription || "Discover premium residential and commercial properties.",
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await saveSettings(settings);
      if (res.success) {
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
      } else {
        alert(res.error || "Failed to save settings");
      }
    } catch {
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md pb-4 pt-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure your real estate platform parameters</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">
            {hasUnsavedChanges ? (
              <span className="text-amber-600 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                Unsaved changes
              </span>
            ) : lastSaved ? (
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle size={14} />
                Saved just now
              </span>
            ) : null}
          </div>
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className="btn btn-primary px-6"
          >
            {isSaving ? (
              <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <><Save size={16} /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-1 sticky top-28">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left
                ${activeTab === tab.id 
                  ? "bg-blue-50 text-blue-700 border border-blue-200" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {activeTab === "general" && (
            <div className="p-6 sm:p-8 space-y-8 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">General Settings</h2>
                <p className="text-slate-500 text-sm">Basic information and platform defaults.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Platform Name</label>
                  <input type="text" className="input" value={settings.siteName} onChange={(e) => handleChange("siteName", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Default City Focus</label>
                  <select className="input" value={settings.defaultCity} onChange={(e) => handleChange("defaultCity", e.target.value)}>
                    <option value="MUMBAI">Mumbai</option>
                    <option value="NAVI_MUMBAI">Navi Mumbai</option>
                    <option value="THANE">Thane</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Support Email</label>
                  <input type="email" className="input" value={settings.supportEmail} onChange={(e) => handleChange("supportEmail", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Support Phone</label>
                  <input type="text" className="input" value={settings.supportPhone} onChange={(e) => handleChange("supportPhone", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "leads" && (
            <div className="p-6 sm:p-8 space-y-8 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">Lead Management</h2>
                <p className="text-slate-500 text-sm">Configure how inquiries are handled and routed.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp Number (with country code)</label>
                  <input type="text" className="input" placeholder="919833378400" value={settings.waNumber} onChange={(e) => handleChange("waNumber", e.target.value)} />
                  <p className="text-xs text-slate-500 mt-1">Number where customer WhatsApp messages are sent.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Lead Follow-up SLA (Hours)</label>
                  <input type="number" className="input" value={settings.leadFollowUpHours} onChange={(e) => handleChange("leadFollowUpHours", e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Default WhatsApp Message</label>
                  <textarea rows={3} className="input resize-none" value={settings.waDefaultMsg} onChange={(e) => handleChange("waDefaultMsg", e.target.value)}></textarea>
                </div>
              </div>
            </div>
          )}

          {activeTab === "property" && (
            <div className="p-6 sm:p-8 space-y-8 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">Property Rules</h2>
                <p className="text-slate-500 text-sm">Set listing parameters and display rules.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Featured Properties</label>
                  <input type="number" className="input" value={settings.featuredLimit} onChange={(e) => handleChange("featuredLimit", e.target.value)} />
                  <p className="text-xs text-slate-500 mt-1">Maximum number of properties shown in the homepage Featured section.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Auto-approve Listings</label>
                  <select className="input" value={settings.autoApproveProperties} onChange={(e) => handleChange("autoApproveProperties", e.target.value)}>
                    <option value="true">Yes, publish immediately</option>
                    <option value="false">No, set as DRAFT by default</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="p-6 sm:p-8 space-y-10 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">SEO Defaults</h2>
                <p className="text-slate-500 text-sm">Global search engine optimization fallbacks and social sharing defaults.</p>
              </div>

              <SettingSection title="Basic SEO" description="Standard meta tags used across the platform.">
                <SettingField label="Site Name" description="The global name of your website.">
                  <input type="text" className="input" value={settings.seoSiteName || ""} onChange={(e) => handleChange("seoSiteName", e.target.value)} placeholder="e.g., PropConnect" />
                </SettingField>
                <SettingField label="Global Title Suffix" description="Appended to all page titles automatically.">
                  <input type="text" className="input" value={settings.seoDefaultTitleSuffix || ""} onChange={(e) => handleChange("seoDefaultTitleSuffix", e.target.value)} />
                </SettingField>
                <SettingField label="Default Meta Description" description="Fallback description used if a specific page lacks one." fullWidth>
                  <textarea rows={2} className="input resize-none" value={settings.seoDefaultDescription || ""} onChange={(e) => handleChange("seoDefaultDescription", e.target.value)}></textarea>
                </SettingField>
              </SettingSection>

              <SettingSection title="Canonical & Robots" description="Search engine crawling and indexing instructions.">
                <SettingField label="Canonical Base URL" description="Base domain for canonical links.">
                  <input type="url" className="input" value={settings.seoCanonicalBase || ""} onChange={(e) => handleChange("seoCanonicalBase", e.target.value)} placeholder="https://thepropconnect.in" />
                </SettingField>
                <SettingField label="Robots Default" description="Default crawling rules for bots.">
                  <select className="input" value={settings.seoRobotsDefault || "index, follow"} onChange={(e) => handleChange("seoRobotsDefault", e.target.value)}>
                    <option value="index, follow">Index, Follow</option>
                    <option value="noindex, follow">No Index, Follow</option>
                    <option value="noindex, nofollow">No Index, No Follow</option>
                  </select>
                </SettingField>
              </SettingSection>

              <SettingSection title="Open Graph (Facebook/LinkedIn)" description="Defaults for social media link previews.">
                <SettingField label="Default OG Title">
                  <input type="text" className="input" value={settings.seoOgTitle || ""} onChange={(e) => handleChange("seoOgTitle", e.target.value)} placeholder="PropConnect - Premium Real Estate" />
                </SettingField>
                <SettingField label="Default OG Image URL">
                  <input type="url" className="input" value={settings.seoOgImage || ""} onChange={(e) => handleChange("seoOgImage", e.target.value)} placeholder="https://..." />
                </SettingField>
                <SettingField label="Default OG Description" fullWidth>
                  <textarea rows={2} className="input resize-none" value={settings.seoOgDescription || ""} onChange={(e) => handleChange("seoOgDescription", e.target.value)}></textarea>
                </SettingField>
              </SettingSection>

              <SettingSection title="Twitter Cards" description="Defaults for Twitter link sharing.">
                <SettingField label="Twitter Title">
                  <input type="text" className="input" value={settings.seoTwitterTitle || ""} onChange={(e) => handleChange("seoTwitterTitle", e.target.value)} placeholder="PropConnect" />
                </SettingField>
                <SettingField label="Twitter Image URL">
                  <input type="url" className="input" value={settings.seoTwitterImage || ""} onChange={(e) => handleChange("seoTwitterImage", e.target.value)} placeholder="https://..." />
                </SettingField>
                <SettingField label="Twitter Description" fullWidth>
                  <textarea rows={2} className="input resize-none" value={settings.seoTwitterDescription || ""} onChange={(e) => handleChange("seoTwitterDescription", e.target.value)}></textarea>
                </SettingField>
              </SettingSection>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function SettingSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200 pb-2">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {children}
      </div>
    </div>
  );
}

function SettingField({ 
  label, 
  description, 
  children, 
  fullWidth = false 
}: { 
  label: string; 
  description?: string; 
  children: React.ReactNode; 
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
    </div>
  );
}
