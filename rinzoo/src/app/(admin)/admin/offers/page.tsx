import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Tag } from "lucide-react";

export const metadata = { title: "Offers — Rinzoo Admin" };

async function getOffers() {
  return db.offer.findMany({
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    include: {
      products: { include: { product: { select: { name: true } } } },
    },
  });
}

const TYPE_COLORS: Record<string, "default" | "secondary" | "warning" | "success"> = {
  TRIAL: "default",
  SEASONAL: "success",
  BULK: "warning",
  PROMO: "secondary",
};

export default async function OffersPage() {
  const offers = await getOffers();
  const now = new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Offers</h2>
          <p className="text-sm text-gray-500 mt-1">{offers.length} offer{offers.length !== 1 ? "s" : ""} total</p>
        </div>
        <Button asChild>
          <Link href="/admin/offers/new">
            <Plus className="h-4 w-4" />
            New Offer
          </Link>
        </Button>
      </div>

      {/* Offers list */}
      {offers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Tag className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No offers yet</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">Create your first offer to engage customers.</p>
            <Button asChild>
              <Link href="/admin/offers/new">
                <Plus className="h-4 w-4" />
                Create Offer
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => {
            const isExpired = offer.expiresAt && offer.expiresAt < now;
            const isScheduled = offer.startsAt > now;

            return (
              <Card key={offer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-50">
                      <Tag className="h-5 w-5 text-[#e91e63]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-gray-900">{offer.title}</h3>
                        <Badge variant={TYPE_COLORS[offer.type]} className="text-xs">{offer.type}</Badge>
                        {isExpired ? (
                          <Badge variant="destructive" className="text-xs">Expired</Badge>
                        ) : isScheduled ? (
                          <Badge variant="warning" className="text-xs">Scheduled</Badge>
                        ) : offer.isActive ? (
                          <Badge variant="success" className="text-xs">Live</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Inactive</Badge>
                        )}
                      </div>

                      <div className="flex gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                        {offer.discountPct && (
                          <span className="font-medium text-[#e91e63]">{offer.discountPct.toString()}% off</span>
                        )}
                        <span>
                          Starts: {new Date(offer.startsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        {offer.expiresAt && (
                          <span>
                            Expires: {new Date(offer.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        )}
                        {offer.priority > 0 && <span>Priority: {offer.priority}</span>}
                      </div>

                      {offer.products.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {offer.products.map((op) => (
                            <span key={op.productId} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                              {op.product.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/offers/${offer.id}/edit`}>
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
