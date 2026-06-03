import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Tag, Gift, Truck, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/landing/PageHero";

export const metadata: Metadata = { title: "Offers — Rinzoo" };

export const revalidate = 1800;

const VARIANTS = [
  { card: "border-[oklch(0.62_0.19_47)]/40 bg-[oklch(0.62_0.19_47)]/10 border-2", iconBg: "bg-[oklch(0.62_0.19_47)]", button: "border-[oklch(0.62_0.19_47)] text-[oklch(0.78_0.16_47)] bg-transparent hover:bg-[oklch(0.62_0.19_47)]/10" },
  { card: "bg-[#2b7fff]/10 border-[#2b7fff]/40 border-2", iconBg: "bg-[#2b7fff]", button: "bg-transparent text-[#5ea3ff] border-[#2b7fff] border-2 hover:bg-[#2b7fff]/10" },
  { card: "bg-neutral-900 border border-white/10", iconBg: "bg-[#2b7fff]", button: "bg-transparent text-[#5ea3ff] border-[#2b7fff] border-2 hover:bg-[#2b7fff]/10" },
];
const ICONS = [Tag, Gift, Truck];

const getActiveOffers = cache(async () => {
  const now = new Date();
  return db.offer.findMany({
    where: {
      isActive: true,
      startsAt: { lte: now },
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    take: 24,
    select: { id: true, title: true, description: true, badgeText: true, type: true, discountPct: true, expiresAt: true },
  });
});

export default async function OffersPage() {
  const offers = await getActiveOffers();

  return (
    <>
      <PageHero
        badge="Special Offers"
        title={<>Current <span className="bg-gradient-to-r from-[#5ea3ff] to-[oklch(0.78_0.12_240)] bg-clip-text text-transparent">Offers</span></>}
        subtitle="Limited-time deals on Rinzoo Detergent Powder. Grab them before they're gone!"
      />

      <div className="max-w-[1140px] mx-auto">
        <section className="px-5 sm:px-8 pb-20">
          {offers.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-3">
              <div className="size-16 rounded-2xl bg-neutral-800 flex items-center justify-center">
                <Gift className="size-8 text-[#5ea3ff]" />
              </div>
              <h2 className="text-2xl font-extrabold text-neutral-50">No active offers right now</h2>
              <p className="text-[#a1a1a1]">Check back soon for exciting deals!</p>
              <Button asChild className="bg-[oklch(0.62_0.19_47)] hover:bg-[oklch(0.58_0.19_47)] font-bold text-white px-7 gap-2 h-12 mt-2">
                <Link href="/products"><ArrowRight className="size-5" />Explore Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer, i) => {
                const v = VARIANTS[i % 3];
                const Icon = ICONS[i % 3];
                return (
                  <Card key={offer.id} className={`rounded-2xl p-6 flex flex-col gap-4 ${v.card}`}>
                    <CardHeader className="p-0 gap-3">
                      <div className="flex items-center justify-between">
                        <div className={`size-11 rounded-xl ${v.iconBg} text-white flex justify-center items-center`}>
                          <Icon className="size-5" />
                        </div>
                        {offer.discountPct && (
                          <span className="font-extrabold text-[#5ea3ff] text-2xl leading-none">
                            {offer.discountPct.toString()}% OFF
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-neutral-50 text-lg leading-7">{offer.title}</CardTitle>
                      {offer.badgeText && (
                        <Badge className="bg-neutral-800 text-[#5ea3ff] font-semibold rounded-full text-xs px-2.5 py-0.5 w-fit">
                          {offer.badgeText}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                      {offer.description && <p className="text-[#a1a1a1] text-sm leading-6">{offer.description}</p>}
                      {offer.expiresAt && (
                        <p className="flex items-center gap-1.5 text-xs text-[#a1a1a1] mt-3">
                          <Clock className="size-3.5" />
                          Ends {new Date(offer.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="p-0">
                      <Button asChild variant="outline" className={`w-full ${v.button}`}>
                        <Link href="/contact">Claim Offer</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
