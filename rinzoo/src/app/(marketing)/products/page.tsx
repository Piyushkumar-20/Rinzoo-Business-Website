import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Sparkles, Flower2, Shirt, IndianRupee, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/landing/PageHero";
import { ProductShowcase, type Pack } from "@/components/landing/ProductShowcase";

export const metadata: Metadata = {
  title: "Products — Rinzoo",
  description: "Rinzoo Detergent Powder in a 90g trial pack (₹8) and 1kg family pack (₹85). Powerful, fabric-friendly cleaning for every household.",
};

export const revalidate = 21600;

const HIGHLIGHTS = [
  { icon: Sparkles, title: "Powerful Stain Removal", desc: "Tough on oil, mud and food stains — gentle on your effort." },
  { icon: Flower2, title: "Fresh Fragrance", desc: "Long-lasting freshness that lingers all day." },
  { icon: Shirt, title: "Fabric Friendly", desc: "Protects colours and fibres, wash after wash." },
  { icon: IndianRupee, title: "Affordable Pricing", desc: "Premium-grade quality at a price every family can trust." },
];

const getProductPacks = cache(async (): Promise<Pack[]> => {
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
    /* fall through */
  }
  return defaults;
});

export default async function ProductsPage() {
  const packs = await getProductPacks();

  return (
    <>
      <PageHero
        badge="Product Showcase"
        title={<>Choose Your <span className="bg-gradient-to-r from-[#5ea3ff] to-[oklch(0.78_0.12_240)] bg-clip-text text-transparent">Rinzoo</span> Pack</>}
        subtitle="Premium cleaning at a price every household can trust — start with ₹8."
      />

      <div className="max-w-[1140px] mx-auto">
        <ProductShowcase packs={packs} />

        {/* Highlights */}
        <section className="px-5 sm:px-8 pb-16 sm:pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HIGHLIGHTS.map((h) => {
              const Icon = h.icon;
              return (
                <Card key={h.title} className="rounded-2xl bg-neutral-900 border border-white/10 p-6 flex flex-col gap-4">
                  <CardHeader className="p-0 gap-3">
                    <div className="size-12 rounded-xl bg-[#2b7fff] text-white flex justify-center items-center">
                      <Icon className="size-6" />
                    </div>
                    <CardTitle className="text-neutral-50 text-lg leading-7">{h.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-[#a1a1a1] text-sm leading-6">{h.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 sm:px-8 pb-20">
          <div className="relative bg-gradient-to-br from-[oklch(0.45_0.18_259)] via-[oklch(0.4_0.16_259)] to-[oklch(0.3_0.12_259)] shadow-2xl shadow-black/40 rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
            <div className="pointer-events-none size-64 bg-[oklch(0.62_0.19_47)]/25 blur-2xl rounded-full absolute -right-10 -top-10" />
            <div className="relative flex flex-col items-center gap-4">
              <Badge className="bg-[oklch(0.62_0.19_47)] font-bold rounded-full text-white text-xs px-3 py-1">Start with ₹8</Badge>
              <h2 className="font-extrabold text-white text-3xl sm:text-4xl tracking-tight">Try the ₹8 Challenge today</h2>
              <p className="text-white/85 max-w-md">Experience premium clean firsthand. Upgrade to the 1kg family pack only if you love it.</p>
              <Button asChild className="bg-[oklch(0.62_0.19_47)] hover:bg-[oklch(0.58_0.19_47)] shadow-lg font-bold text-white px-7 gap-2 h-12 mt-2">
                <Link href="/contact"><ArrowRight className="size-5" />Contact Us to Order</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
