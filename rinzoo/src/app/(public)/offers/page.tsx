import { db } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Offers — Rinzoo" };

async function getActiveOffers() {
  const now = new Date();
  return db.offer.findMany({
    where: {
      isActive: true,
      startsAt: { lte: now },
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    include: { products: { include: { product: true } } },
  });
}

export default async function OffersPage() {
  const offers = await getActiveOffers();

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0d1f4a] pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Current <span className="text-[#e91e63]">Offers</span>
          </h1>
          <p className="mt-4 text-gray-300 max-w-xl mx-auto">
            Limited-time deals on Rinzoo Detergent Powder. Grab them before they&apos;re gone!
          </p>
        </div>
      </section>

      {/* Offers list */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {offers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🎁</p>
              <h2 className="text-2xl font-extrabold text-gray-900">No active offers right now</h2>
              <p className="text-gray-500 mt-2">Check back soon for exciting deals!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="rounded-2xl border border-gray-100 shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="bg-gradient-to-r from-[#e91e63] to-[#c2185b] p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-pink-100 bg-white/20 px-3 py-1 rounded-full">
                        {offer.type}
                      </span>
                      {offer.discountPct && (
                        <span className="text-2xl font-extrabold text-white">
                          {offer.discountPct.toString()}% OFF
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-extrabold text-white mt-3">{offer.title}</h3>
                    {offer.badgeText && (
                      <p className="text-pink-100 text-sm mt-1">{offer.badgeText}</p>
                    )}
                  </div>
                  <div className="p-5">
                    {offer.description && (
                      <p className="text-gray-600 text-sm">{offer.description}</p>
                    )}
                    {offer.expiresAt && (
                      <p className="text-xs text-gray-400 mt-3">
                        Expires:{" "}
                        {new Date(offer.expiresAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
