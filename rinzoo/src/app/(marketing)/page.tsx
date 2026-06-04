import { cache } from "react";
import { db } from "@/lib/db";
import { getSiteContent, isVisible } from "@/lib/content";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Challenge } from "@/components/landing/Challenge";
import { ProductShowcase, type Pack } from "@/components/landing/ProductShowcase";
import { WhyDifferent } from "@/components/landing/WhyDifferent";
import { About } from "@/components/landing/About";
import { Offers, type OfferCard } from "@/components/landing/Offers";

// ISR — regenerate at most once per hour
export const revalidate = 3600;

// ── Dynamic data, connected to existing systems ──────────────────────────────

const getActiveOffers = cache(async (): Promise<OfferCard[]> => {
  const now = new Date();
  try {
    const offers = await db.offer.findMany({
      where: {
        isActive: true,
        startsAt: { lte: now },
        OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: 3,
      select: { title: true, description: true, type: true },
    });
    if (offers.length > 0) {
      return offers.map((o) => ({
        title: o.title,
        description: o.description ?? "",
        type: o.type,
        cta: "Claim Offer",
      }));
    }
  } catch {
    // DB unavailable at build — fall through to defaults
  }

  // Fallback: the approved design's default offer cards
  return [
    { title: "First-Time Buyer", description: "Get your first 90g pack at just ₹8 — risk-free introduction to Rinzoo.", type: "TRIAL", cta: "Claim Offer" },
    { title: "Family Bundle", description: "Buy 3 x 1kg packs and save big on your monthly laundry budget.", type: "BULK", cta: "View Bundle" },
    { title: "Retailer Special", description: "Exclusive bulk pricing and margins for our trusted retail partners.", type: "PROMO", cta: "Enquire Now" },
  ];
});

const getProductPacks = cache(async (): Promise<Pack[]> => {
  // Default packs from the approved design
  const defaults: Pack[] = [
    {
      badgeText: "Trial Pack",
      title: "90g Trial Pack",
      price: "₹8",
      desc: "Perfect for first-time users. Test premium quality at minimal cost.",
      features: ["Ideal for 2-3 washes", "Single-use family value"],
      image: "/images/pack-compare.jpeg",
      highlight: false,
    },
    {
      badgeText: "Family Pack",
      title: "1kg Family Pack",
      price: "₹85",
      desc: "The everyday choice for households that want lasting value.",
      features: ["Up to 30 washes", "Best price per wash"],
      image: "/images/image.png",
      highlight: true,
    },
  ];

  try {
    const product = await db.product.findFirst({
      where: { isActive: true },
      include: { variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } },
    });
    if (product && product.variants.length >= 2) {
      return product.variants.slice(0, 2).map((v, i) => ({
        badgeText: v.isTrial ? "Trial Pack" : "Family Pack",
        title: `${v.size} ${v.isTrial ? "Trial" : "Family"} Pack`,
        price: `₹${Number(v.price).toFixed(0)}`,
        desc: defaults[i]?.desc ?? product.tagline ?? "",
        features: product.features.slice(0, 2).length ? product.features.slice(0, 2) : defaults[i].features,
        image: i === 0 ? "/images/pack-compare.jpeg" : "/images/image.png",
        highlight: !v.isTrial,
      }));
    }
  } catch {
    // fall through to defaults
  }

  return defaults;
});

export default async function HomePage() {
  const [offers, packs, content] = await Promise.all([
    getActiveOffers(),
    getProductPacks(),
    getSiteContent(),
  ]);

  return (
    <main className="max-w-[1140px] mx-auto">
      {isVisible(content, "hero") && <Hero content={content.hero} />}
      {isVisible(content, "features") && <Features />}
      {isVisible(content, "challenge") && <Challenge />}
      {isVisible(content, "productShowcase") && <ProductShowcase packs={packs} />}
      {isVisible(content, "whyDifferent") && <WhyDifferent />}
      {isVisible(content, "about") && <About />}
      {isVisible(content, "offers") && <Offers offers={offers} />}
    </main>
  );
}
