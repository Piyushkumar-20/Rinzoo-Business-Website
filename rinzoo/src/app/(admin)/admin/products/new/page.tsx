import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/products/ProductForm";

export const metadata = { title: "New Product — Rinzoo Admin" };

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">New Product</h2>
        <p className="text-sm text-gray-500 mt-1">Fill in the details to create a new product. You can add variants (pack sizes &amp; prices) after saving.</p>
      </div>

      <ProductForm />
    </div>
  );
}
