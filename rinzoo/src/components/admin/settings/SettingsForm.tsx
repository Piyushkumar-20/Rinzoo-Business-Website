"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SettingType = "STRING" | "NUMBER" | "BOOLEAN" | "JSON";

interface Setting {
  key: string;
  label: string;
  group: string;
  type: SettingType;
  value: string;
  default: string;
}

interface Props {
  settings: Setting[];
}

export function SettingsForm({ settings }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(settings.map((s) => [s.key, s.value]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Group settings
  const groups = Array.from(new Set(settings.map((s) => s.group)));

  const handleSave = async () => {
    setError(null);
    setSaved(false);
    setSaving(true);

    try {
      const res = await fetch("/api/v1/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json?.error?.message ?? "Failed to save settings");
        return;
      }

      setSaved(true);
      startTransition(() => router.refresh());
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {groups.map((group) => {
        const groupSettings = settings.filter((s) => s.group === group);
        return (
          <Card key={group}>
            <CardHeader>
              <CardTitle className="text-base">{group}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupSettings.map((setting) => (
                <div key={setting.key} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                  <div className="sm:col-span-1">
                    <Label className="text-sm font-medium text-gray-700">{setting.label}</Label>
                    <p className="text-xs text-gray-400 mt-0.5">{setting.key}</p>
                  </div>
                  <div className="sm:col-span-2">
                    {setting.type === "BOOLEAN" ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={values[setting.key] === "true"}
                          onChange={(e) =>
                            setValues((v) => ({ ...v, [setting.key]: e.target.checked ? "true" : "false" }))
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {values[setting.key] === "true" ? "Enabled" : "Disabled"}
                        </span>
                      </label>
                    ) : (
                      <div>
                        <Input
                          type={setting.type === "NUMBER" ? "number" : "text"}
                          value={values[setting.key] ?? ""}
                          onChange={(e) =>
                            setValues((v) => ({ ...v, [setting.key]: e.target.value }))
                          }
                          placeholder={setting.default}
                        />
                        {values[setting.key] !== setting.default && (
                          <button
                            type="button"
                            onClick={() => setValues((v) => ({ ...v, [setting.key]: setting.default }))}
                            className="mt-1 text-xs text-gray-400 hover:text-gray-600 underline"
                          >
                            Reset to default
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Save button */}
      <div className="flex items-center gap-4 sticky bottom-0 bg-white/90 backdrop-blur-sm py-4 border-t border-gray-100 -mx-1 px-1">
        <Button onClick={handleSave} disabled={saving || isPending} className="min-w-[140px]">
          {(saving || isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving || isPending ? "Saving…" : "Save All Settings"}
        </Button>
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            Saved successfully
          </div>
        )}
      </div>
    </div>
  );
}
