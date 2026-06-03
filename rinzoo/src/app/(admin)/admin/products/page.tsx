import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Package } from "lucide-react";

export const metadata = { title: "Products — Rinzoo Admin" };

async function getProducts() {
  return db.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { variants: { orderBy: { sortOrder: "asc" } } },
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mt-1">{products.length} product{products.length !== 1 ? "s" : ""} total</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            New Product
          </Link>
        </Button>
      </div>

      {/* Products list */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No products yet</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">Create your first product to get started.</p>
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4" />
                Create Product
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-start gap-4">
                  {/* Color indicator */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
                      {product.isFeatured && <Badge variant="default" className="text-xs">Featured</Badge>}
                      <Badge variant={product.isActive ? "success" : "secondary"} className="text-xs">
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">/{product.slug}</p>
                    {product.tagline && (
                      <p className="text-xs text-gray-600 mt-1 italic">{product.tagline}</p>
                    )}

                    {/* Variants chips */}
                    {product.variants.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {product.variants.map((v) => (
                          <span
                            key={v.id}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                          >
                            {v.size} — ₹{Number(v.price).toFixed(0)}
                          </span>
                        ))}
                      </div>
                    )}
                    {product.variants.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1">⚠ No variants — add sizes & prices after editing</p>
                    )}
                  </div>
                </div>

                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
