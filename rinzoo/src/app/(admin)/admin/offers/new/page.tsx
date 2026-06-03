import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { OfferForm } from "@/components/admin/offers/OfferForm";

export const metadata = { title: "New Offer — Rinzoo Admin" };

async function getProducts() {
  return db.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });
}

export default async function NewOfferPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/offers"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Offers
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">New Offer</h2>
        <p className="text-sm text-gray-500 mt-1">Create a new time-limited offer for customers.</p>
      </div>

      <OfferForm products={products} />
    </div>
  );
}
