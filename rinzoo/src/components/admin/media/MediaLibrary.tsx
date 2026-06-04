"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Upload, Search, Trash2, Copy, Check, Loader2, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MediaItem {
  id: string;
  url: string;
  originalName: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: string;
}

interface Meta {
  total: number;
  page: number;
  totalPages: number;
}

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function MediaLibrary({ cloudinaryReady }: { cloudinaryReady: boolean }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, totalPages: 1 });
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async (search: string, pageNum: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      params.set("page", String(pageNum));
      const res = await fetch(`/api/v1/admin/media?${params.toString()}`);
      const json = await res.json();
      setItems(json.data ?? []);
      setMeta(json.meta ?? { total: 0, page: 1, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(q, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load(q, 1);
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          setError(`"${file.name}" is not an image — skipped.`);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          setError(`"${file.name}" exceeds 10MB — skipped.`);
          continue;
        }
        const dataUri = await fileToDataUri(file);
        const res = await fetch("/api/v1/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: dataUri, fileName: file.name }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          setError(j?.error?.message ?? `Failed to upload "${file.name}"`);
        }
      }
      setPage(1);
      await load(q, 1);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const copyUrl = async (item: MediaItem) => {
    await navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const remove = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.originalName}"? This removes it from Cloudinary permanently.`)) return;
    setDeletingId(item.id);
    try {
      const res = await fetch(`/api/v1/admin/media/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((m) => m.id !== item.id));
        if (preview?.id === item.id) setPreview(null);
      } else {
        alert("Failed to delete. Please try again.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {!cloudinaryReady && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Cloudinary isn&apos;t configured. Set <code className="font-mono">CLOUDINARY_URL</code> to enable uploads.
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search images by name…"
            className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {q && (
            <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
        <Button onClick={() => fileInput.current?.click()} disabled={uploading || !cloudinaryReady} className="shrink-0">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Upload Images"}
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ImageIcon className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-900">{q ? "No images match your search" : "No media yet"}</h3>
            <p className="text-sm text-gray-500 mt-1">{q ? "Try a different term." : "Upload your first image to get started."}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-xl border border-gray-200 overflow-hidden bg-white">
              <button onClick={() => setPreview(item)} className="block w-full aspect-square relative bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.altText ?? item.originalName} className="w-full h-full object-cover" loading="lazy" />
              </button>
              <div className="p-2">
                <p className="text-xs font-medium text-gray-700 truncate" title={item.originalName}>{item.originalName}</p>
                <p className="text-[10px] text-gray-400">{formatBytes(item.sizeBytes)}{item.width ? ` · ${item.width}×${item.height}` : ""}</p>
              </div>
              {/* Hover actions */}
              <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => copyUrl(item)} title="Copy URL" className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 shadow text-gray-600 hover:text-blue-600">
                  {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <button onClick={() => remove(item)} disabled={deletingId === item.id} title="Delete" className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 shadow text-gray-600 hover:text-red-600">
                  {deletingId === item.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {meta.page} of {meta.totalPages} · {meta.total} images</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative bg-gray-100 flex items-center justify-center max-h-[60vh] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt={preview.altText ?? preview.originalName} className="max-w-full max-h-[60vh] object-contain" />
              <button onClick={() => setPreview(null)} className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="font-semibold text-gray-900">{preview.originalName}</p>
                <p className="text-xs text-gray-500">{formatBytes(preview.sizeBytes)}{preview.width ? ` · ${preview.width}×${preview.height}` : ""} · {preview.mimeType}</p>
              </div>
              <div className="flex items-center gap-2">
                <input readOnly value={preview.url} className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600" onFocus={(e) => e.target.select()} />
                <Button size="sm" onClick={() => copyUrl(preview)}>
                  {copiedId === preview.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy URL
                </Button>
              </div>
              <div className="flex justify-end">
                <Button variant="destructive" size="sm" onClick={() => remove(preview)} disabled={deletingId === preview.id}>
                  {deletingId === preview.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
