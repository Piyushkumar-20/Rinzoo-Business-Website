"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// HTML inputs always yield strings; numeric fields kept as string, converted in onSubmit
const schema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  badgeText: z.string().optional(),
  type: z.enum(["TRIAL", "SEASONAL", "BULK", "PROMO"]),
  discountPct: z.string().optional(),
  startsAt: z.string().min(1, "Start date is required"),
  expiresAt: z.string().optional(),
  isActive: z.boolean(),
  priority: z.string().default("0"),
});

type FormData = z.infer<typeof schema>;

interface Product {
  id: string;
  name: string;
}

interface Props {
  offerId?: string;
  products: Product[];
  defaultValues?: Partial<Omit<FormData, "discountPct" | "priority"> & {
    discountPct: number;
    priority: number;
    productIds: string[];
  }>;
}

const OFFER_TYPES = [
  { value: "TRIAL", label: "Trial" },
  { value: "SEASONAL", label: "Seasonal" },
  { value: "BULK", label: "Bulk" },
  { value: "PROMO", label: "Promo" },
];

function toDatetimeLocal(iso?: string | Date | null) {
  if (!iso) return "";
  const d = new Date(iso as string);
  // Format as YYYY-MM-DDTHH:mm for datetime-local input
  return d.toISOString().slice(0, 16);
}

export function OfferForm({ offerId, products, defaultValues }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    defaultValues?.productIds ?? []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      badgeText: defaultValues?.badgeText ?? "",
      type: defaultValues?.type ?? "PROMO",
      discountPct: defaultValues?.discountPct != null ? String(defaultValues.discountPct) : "",
      startsAt: toDatetimeLocal(defaultValues?.startsAt as string),
      expiresAt: toDatetimeLocal(defaultValues?.expiresAt as string),
      isActive: defaultValues?.isActive ?? true,
      priority: String(defaultValues?.priority ?? 0),
    },
  });

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    const url = offerId ? `/api/v1/admin/offers/${offerId}` : "/api/v1/admin/offers";
    const method = offerId ? "PUT" : "POST";

    const payload = {
      ...data,
      discountPct: data.discountPct && data.discountPct !== "" ? parseFloat(data.discountPct) : undefined,
      priority: parseInt(data.priority) || 0,
      startsAt: new Date(data.startsAt).toISOString(),
      expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
      productIds: selectedProductIds,
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      setServerError(json?.error?.message ?? json?.error ?? "Something went wrong");
      return;
    }

    router.push("/admin/offers");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Main details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Offer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input {...register("title")} placeholder="Summer Sale — 10% Off" />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Badge Text</Label>
              <Input {...register("badgeText")} placeholder="LIMITED OFFER" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea {...register("description")} rows={3} placeholder="Offer details visible to customers..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Type *</Label>
              <select
                {...register("type")}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {OFFER_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Discount %</Label>
              <Input {...register("discountPct")} type="number" step="0.01" placeholder="10" />
              {errors.discountPct && <p className="text-xs text-red-500">{errors.discountPct.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Input {...register("priority")} type="number" placeholder="0 = lowest" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Starts At *</Label>
              <Input {...register("startsAt")} type="datetime-local" />
              {errors.startsAt && <p className="text-xs text-red-500">{errors.startsAt.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Expires At (optional)</Label>
              <Input {...register("expiresAt")} type="datetime-local" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="isActive" className="cursor-pointer">Active (show to customers immediately)</Label>
          </div>
        </CardContent>
      </Card>

      {/* Linked Products */}
      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Linked Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500 mb-3">Select which products this offer applies to.</p>
            <div className="space-y-2">
              {products.map((p) => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedProductIds.includes(p.id)}
                    onChange={() => toggleProduct(p.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {p.name}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving…" : offerId ? "Save Changes" : "Create Offer"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/offers")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
