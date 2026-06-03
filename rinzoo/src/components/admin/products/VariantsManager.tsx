"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Variant {
  id: string;
  size: string;
  price: string | number;
  mrp: string | number;
  sku: string | null;
  isTrial: boolean;
  isActive: boolean;
  sortOrder: number;
}

interface Props {
  productId: string;
  initialVariants: Variant[];
}

const EMPTY_FORM = { size: "", price: "", mrp: "", sku: "", isTrial: false, isActive: true, sortOrder: 0 };

export function VariantsManager({ productId, initialVariants }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(EMPTY_FORM);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    setError(null);
    if (!form.size || !form.price || !form.mrp) {
      setError("Size, Price, and MRP are required");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch(`/api/v1/admin/products/${productId}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          mrp: parseFloat(form.mrp),
          sortOrder: Number(form.sortOrder),
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json?.error?.message ?? "Failed to add variant");
        return;
      }

      setForm(EMPTY_FORM);
      startTransition(() => router.refresh());
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (variantId: string) => {
    setDeletingId(variantId);
    try {
      await fetch(`/api/v1/admin/products/${productId}/variants/${variantId}`, { method: "DELETE" });
      startTransition(() => router.refresh());
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing variants */}
      {initialVariants.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No variants yet. Add one below.</p>
      ) : (
        <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 overflow-hidden">
          {initialVariants.map((v) => (
            <div key={v.id} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{v.size}</p>
                  <p className="text-xs text-gray-500">
                    ₹{Number(v.price).toFixed(2)} · MRP ₹{Number(v.mrp).toFixed(2)}
                    {v.sku && ` · SKU: ${v.sku}`}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {v.isTrial && <Badge variant="default" className="text-xs">Trial</Badge>}
                  <Badge variant={v.isActive ? "success" : "secondary"} className="text-xs">
                    {v.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(v.id)}
                disabled={deletingId === v.id || isPending}
                className="text-gray-400 hover:text-red-500"
              >
                {deletingId === v.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add variant form */}
      <div className="rounded-lg border border-dashed border-gray-300 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Add Variant</p>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Size *</Label>
            <Input
              value={form.size}
              onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
              placeholder="90g / 1kg"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Price (₹) *</Label>
            <Input
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              type="number"
              step="0.01"
              placeholder="8.00"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">MRP (₹) *</Label>
            <Input
              value={form.mrp}
              onChange={(e) => setForm((f) => ({ ...f, mrp: e.target.value }))}
              type="number"
              step="0.01"
              placeholder="10.00"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">SKU</Label>
            <Input
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              placeholder="RNZ-90G"
              className="h-8 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isTrial}
              onChange={(e) => setForm((f) => ({ ...f, isTrial: e.target.checked }))}
              className="h-3.5 w-3.5"
            />
            Trial pack
          </label>
          <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="h-3.5 w-3.5"
            />
            Active
          </label>
          <Button
            type="button"
            size="sm"
            onClick={handleAdd}
            disabled={adding || isPending}
            className="ml-auto"
          >
            {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Add Variant
          </Button>
        </div>
      </div>
    </div>
  );
}
