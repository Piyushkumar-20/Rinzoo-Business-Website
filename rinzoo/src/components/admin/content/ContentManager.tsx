"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, ChevronDown, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FieldType = "text" | "textarea" | "url" | "image" | "boolean";
interface Field { key: string; label: string; type: FieldType; placeholder?: string }
interface Section {
  key: string;
  label: string;
  description: string;
  fields: Field[];
  values: Record<string, string | boolean>;
}

export function ContentManager() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/admin/content")
      .then((r) => r.json())
      .then((j) => {
        setSections(j.data ?? []);
        setOpen(j.data?.[0]?.key ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  const setValue = (sectionKey: string, fieldKey: string, value: string | boolean) => {
    setSections((prev) =>
      prev.map((s) => (s.key === sectionKey ? { ...s, values: { ...s.values, [fieldKey]: value } } : s))
    );
  };

  const save = async (section: Section) => {
    setError(null);
    setSavingKey(section.key);
    setSavedKey(null);
    try {
      const res = await fetch("/api/v1/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionKey: section.key, values: section.values }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error?.message ?? "Failed to save");
        return;
      }
      setSavedKey(section.key);
      setTimeout(() => setSavedKey(null), 2500);
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      {sections.map((section) => {
        const isOpen = open === section.key;
        const hidden = section.values.visible === false;
        return (
          <Card key={section.key} className="overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              onClick={() => setOpen(isOpen ? null : section.key)}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{section.label}</span>
                  {hidden && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Hidden</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <CardContent className="border-t border-gray-100 pt-5 space-y-4">
                {section.fields.map((field) => {
                  const value = section.values[field.key];
                  if (field.type === "boolean") {
                    return (
                      <label key={field.key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value === true}
                          onChange={(e) => setValue(section.key, field.key, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">{field.label}</span>
                      </label>
                    );
                  }
                  if (field.type === "textarea") {
                    return (
                      <div key={field.key} className="space-y-1.5">
                        <Label>{field.label}</Label>
                        <Textarea
                          rows={3}
                          value={(value as string) ?? ""}
                          onChange={(e) => setValue(section.key, field.key, e.target.value)}
                        />
                      </div>
                    );
                  }
                  if (field.type === "image") {
                    const url = (value as string) ?? "";
                    return (
                      <div key={field.key} className="space-y-1.5">
                        <Label>{field.label}</Label>
                        <div className="flex items-start gap-3">
                          <div className="h-16 w-16 shrink-0 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                            {url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="Paste an image URL (copy from Media Library)"
                              value={url}
                              onChange={(e) => setValue(section.key, field.key, e.target.value)}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              Upload in Media Library, then copy its URL here.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={field.key} className="space-y-1.5">
                      <Label>{field.label}</Label>
                      <Input
                        placeholder={field.placeholder}
                        value={(value as string) ?? ""}
                        onChange={(e) => setValue(section.key, field.key, e.target.value)}
                      />
                    </div>
                  );
                })}

                <div className="flex items-center gap-3 pt-2">
                  <Button onClick={() => save(section)} disabled={savingKey === section.key} className="min-w-[120px]">
                    {savingKey === section.key ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {savingKey === section.key ? "Saving…" : "Save Section"}
                  </Button>
                  {savedKey === section.key && (
                    <span className="flex items-center gap-1.5 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" /> Saved
                    </span>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
