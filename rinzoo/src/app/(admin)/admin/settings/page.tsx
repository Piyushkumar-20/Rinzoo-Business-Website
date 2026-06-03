import { db } from "@/lib/db";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { SETTINGS_SCHEMA } from "@/app/api/v1/admin/settings/route";

export const metadata = { title: "Settings — Rinzoo Admin" };

async function getSettings() {
  const dbSettings = await db.setting.findMany();
  const settingsMap = Object.fromEntries(dbSettings.map((s) => [s.key, s.value]));

  return SETTINGS_SCHEMA.map((s) => ({
    ...s,
    value: settingsMap[s.key] ?? s.default,
  }));
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure contact info, display options, and branding for the Rinzoo website.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
