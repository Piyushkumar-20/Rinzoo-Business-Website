import Link from "next/link";
import { db } from "@/lib/db";
import { Tag, ArrowRight, Clock } from "lucide-react";

async function getActiveOffers() {
  const now = new Date();
  return db.offer.findMany({
    where: {
      isActive: true,
      startsAt: { lte: now },
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    take: 4,
  });
}

const TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  TRIAL:    { bg: "bg-blue-100",  text: "text-blue-700" },
  SEASONAL: { bg: "bg-green-100", text: "text-green-700" },
  BULK:     { bg: "bg-amber-100", text: "text-amber-700" },
  PROMO:    { bg: "bg-pink-100",  text: "text-[#e91e63]" },
};

export async function ActiveOffersSection() {
  const offers = await getActiveOffers();

  // Don't render the section at all when no offers are active
  if (offers.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {/* Animated badge */}
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e91e63] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#e91e63]" />
            </span>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Current <span className="text-[#e91e63]">Offers</span>
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">Limited-time deals — grab them before they&apos;re gone</p>
            </div>
          </div>
          <Link
            href="/offers"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#e91e63] hover:underline"
          >
            View all offers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Offer cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {offers.map((offer) => {
            const style = TYPE_STYLES[offer.type] ?? TYPE_STYLES.PROMO;
            return (
              <div
                key={offer.id}
                className="group relative rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-[#e91e63] to-[#c2185b]" />

                <div className="p-5">
                  {/* Type chip + discount */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.bg} ${style.text}`}>
                      <Tag className="h-3 w-3" />
                      {offer.type}
                    </span>
                    {offer.discountPct && (
                      <span className="text-xl font-extrabold text-[#e91e63]">
                        {offer.discountPct.toString()}% OFF
                      </span>
                    )}
                  </div>

                  {/* Badge text */}
                  {offer.badgeText && (
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                      {offer.badgeText}
                    </p>
                  )}

                  {/* Title */}
                  <h3 className="font-extrabold text-gray-900 leading-snug line-clamp-2">
                    {offer.title}
                  </h3>

                  {/* Description */}
                  {offer.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{offer.description}</p>
                  )}

                  {/* Expiry */}
                  {offer.expiresAt && (
                    <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>
                        Ends{" "}
                        {new Date(offer.expiresAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile view-all link */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/offers"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e91e63] hover:underline"
          >
            View all offers <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
