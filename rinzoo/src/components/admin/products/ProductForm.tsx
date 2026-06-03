"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// HTML inputs always yield strings; number fields kept as string and converted in onSubmit
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  tagline: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.string().default("0"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  productId?: string;
  defaultValues?: Partial<Omit<FormData, "sortOrder"> & { sortOrder: number; features: string[] }>;
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function ProductForm({ productId, defaultValues }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  // Features managed separately (array of strings)
  const [features, setFeatures] = useState<string[]>(defaultValues?.features ?? []);
  const [featureInput, setFeatureInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: defaultValues?.name ?? "",
      slug: defaultValues?.slug ?? "",
      tagline: defaultValues?.tagline ?? "",
      description: defaultValues?.description ?? "",
      imageUrl: defaultValues?.imageUrl ?? "",
      isFeatured: defaultValues?.isFeatured ?? false,
      isActive: defaultValues?.isActive ?? true,
      sortOrder: String(defaultValues?.sortOrder ?? 0),
      seoTitle: defaultValues?.seoTitle ?? "",
      seoDescription: defaultValues?.seoDescription ?? "",
    },
  });

  const nameValue = watch("name");

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    const url = productId
      ? `/api/v1/admin/products/${productId}`
      : "/api/v1/admin/products";
    const method = productId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        sortOrder: parseInt(data.sortOrder) || 0,
        imageUrl: data.imageUrl || undefined,
        features,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      setServerError(json?.error?.message ?? json?.error ?? "Something went wrong");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures((prev) => [...prev, trimmed]);
      setFeatureInput("");
    }
  };

  const removeFeature = (idx: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Basic info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Product Name *</Label>
              <Input
                {...register("name")}
                placeholder="Rinzoo Detergent Powder"
                onChange={(e) => {
                  register("name").onChange(e);
                  if (!productId) {
                    setValue("slug", toSlug(e.target.value));
                  }
                }}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input {...register("slug")} placeholder="rinzoo-detergent-powder" />
              {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Tagline</Label>
            <Input {...register("tagline")} placeholder="The #1 laundry powder for every household" />
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea {...register("description")} rows={4} placeholder="Detailed product description..." />
          </div>

          <div className="space-y-1.5">
            <Label>Image URL</Label>
            <Input {...register("imageUrl")} placeholder="https://..." />
            {errors.imageUrl && <p className="text-xs text-red-500">{errors.imageUrl.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addFeature(); }
              }}
              placeholder="e.g. Removes tough stains"
            />
            <Button type="button" variant="outline" size="icon" onClick={addFeature}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {features.length > 0 && (
            <ul className="space-y-1.5">
              {features.map((f, i) => (
                <li key={i} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm">
                  <span>{f}</span>
                  <button type="button" onClick={() => removeFeature(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Sort Order</Label>
              <Input {...register("sortOrder")} type="number" placeholder="0" />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isActive"
                {...register("isActive")}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isFeatured"
                {...register("isFeatured")}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="isFeatured" className="cursor-pointer">Featured on homepage</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SEO (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>SEO Title</Label>
            <Input {...register("seoTitle")} placeholder="Overrides page title in search results" />
          </div>
          <div className="space-y-1.5">
            <Label>SEO Description</Label>
            <Textarea {...register("seoDescription")} rows={2} placeholder="Meta description for search engines..." />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving…" : productId ? "Save Changes" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
