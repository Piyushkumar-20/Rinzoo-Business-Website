import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { OfferForm } from "@/components/admin/offers/OfferForm";
import { DeleteOfferButton } from "@/components/admin/offers/DeleteOfferButton";

export const metadata = { title: "Edit Offer — Rinzoo Admin" };

type Params = { params: Promise<{ id: string }> };

async function getOffer(id: string) {
  return db.offer.findUnique({
    where: { id },
    include: {
      products: { include: { product: { select: { id: true, name: true } } } },
    },
  });
}

async function getProducts() {
  return db.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });
}

export default async function EditOfferPage({ params }: Params) {
  const { id } = await params;
  const [offer, products] = await Promise.all([getOffer(id), getProducts()]);

  if (!offer) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/offers"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Offers
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">{offer.title}</h2>
          <p className="text-sm text-gray-500 mt-1 capitalize">{offer.type.toLowerCase()} offer</p>
        </div>
        <DeleteOfferButton offerId={offer.id} offerTitle={offer.title} />
      </div>

      <OfferForm
        offerId={offer.id}
        products={products}
        defaultValues={{
          title: offer.title,
          description: offer.description ?? undefined,
          badgeText: offer.badgeText ?? undefined,
          type: offer.type,
          discountPct: offer.discountPct ? Number(offer.discountPct) : undefined,
          startsAt: offer.startsAt.toISOString(),
          expiresAt: offer.expiresAt?.toISOString() ?? undefined,
          isActive: offer.isActive,
          priority: offer.priority,
          productIds: offer.products.map((op) => op.productId),
        }}
      />
    </div>
  );
}
