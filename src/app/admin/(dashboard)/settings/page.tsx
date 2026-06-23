import SettingsClient from "./SettingsClient";
import { getSettings } from "./actions";

export default async function SettingsPage() {
  const initialSettings = await getSettings();

  return <SettingsClient initialSettings={initialSettings} />;
}
