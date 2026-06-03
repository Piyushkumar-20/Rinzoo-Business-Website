import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { VariantsManager } from "@/components/admin/products/VariantsManager";
import { DeleteProductButton } from "@/components/admin/products/DeleteProductButton";

export const metadata = { title: "Edit Product — Rinzoo Admin" };

type Params = { params: Promise<{ id: string }> };

async function getProduct(id: string) {
  return db.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { sortOrder: "asc" } } },
  });
}

export default async function EditProductPage({ params }: Params) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <p className="text-sm text-gray-500 mt-1">/{product.slug}</p>
        </div>
        <DeleteProductButton productId={product.id} productName={product.name} />
      </div>

      {/* Product details form */}
      <ProductForm
        productId={product.id}
        defaultValues={{
          name: product.name,
          slug: product.slug,
          tagline: product.tagline ?? undefined,
          description: product.description ?? undefined,
          features: product.features,
          imageUrl: product.imageUrl ?? undefined,
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          sortOrder: product.sortOrder,
          seoTitle: product.seoTitle ?? undefined,
          seoDescription: product.seoDescription ?? undefined,
        }}
      />

      {/* Variants manager */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pack Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <VariantsManager
            productId={product.id}
            initialVariants={product.variants.map((v) => ({
              ...v,
              price: v.price.toString(),
              mrp: v.mrp.toString(),
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
