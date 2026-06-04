"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2, ChevronDown, ImageIcon, Upload, FolderOpen, X } from "lucide-react";
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

interface MediaItem { id: string; url: string; originalName: string }

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function ContentManager() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Image upload + media picker state
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [picker, setPicker] = useState<{ sectionKey: string; fieldKey: string } | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const uploadTarget = useRef<{ sectionKey: string; fieldKey: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

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

  const triggerUpload = (sectionKey: string, fieldKey: string) => {
    uploadTarget.current = { sectionKey, fieldKey };
    fileInput.current?.click();
  };

  const onFilePicked = async (files: FileList | null) => {
    const target = uploadTarget.current;
    if (!files || !files[0] || !target) return;
    const file = files[0];
    setError(null);
    setUploadingField(`${target.sectionKey}.${target.fieldKey}`);
    try {
      const dataUri = await fileToDataUri(file);
      const res = await fetch("/api/v1/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: dataUri, fileName: file.name }),
      });
      const j = await res.json();
      if (!res.ok) { setError(j?.error?.message ?? "Upload failed"); return; }
      setValue(target.sectionKey, target.fieldKey, j.data.url);
    } finally {
      setUploadingField(null);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const openPicker = async (sectionKey: string, fieldKey: string) => {
    setPicker({ sectionKey, fieldKey });
    setMediaLoading(true);
    try {
      const res = await fetch("/api/v1/admin/media?page=1");
      const j = await res.json();
      setMedia(j.data ?? []);
    } finally {
      setMediaLoading(false);
    }
  };

  const chooseFromLibrary = (url: string) => {
    if (picker) setValue(picker.sectionKey, picker.fieldKey, url);
    setPicker(null);
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
                    const fieldId = `${section.key}.${field.key}`;
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
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder="Image URL (or use the buttons →)"
                              value={url}
                              onChange={(e) => setValue(section.key, field.key, e.target.value)}
                            />
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => triggerUpload(section.key, field.key)}
                                disabled={uploadingField === fieldId}
                              >
                                {uploadingField === fieldId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                                Upload
                              </Button>
                              <Button type="button" variant="outline" size="sm" onClick={() => openPicker(section.key, field.key)}>
                                <FolderOpen className="h-3.5 w-3.5" />
                                Choose from Library
                              </Button>
                              {url && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => setValue(section.key, field.key, "")} className="text-gray-400">
                                  Clear
                                </Button>
                              )}
                            </div>
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

      {/* Hidden file input shared by all image fields */}
      <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => onFilePicked(e.target.files)} />

      {/* Media Library picker modal */}
      {picker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPicker(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Choose from Media Library</h3>
              <button onClick={() => setPicker(null)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 overflow-y-auto">
              {mediaLoading ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {[...Array(8)].map((_, i) => <div key={i} className="aspect-square rounded-lg bg-gray-100 animate-pulse" />)}
                </div>
              ) : media.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-10">No images yet. Upload some in the Media Library first.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {media.map((m) => (
                    <button key={m.id} onClick={() => chooseFromLibrary(m.url)} className="group rounded-lg border border-gray-200 overflow-hidden hover:border-blue-500 transition-colors">
                      <div className="aspect-square bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.url} alt={m.originalName} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <p className="text-[10px] text-gray-500 truncate px-1.5 py-1">{m.originalName}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
