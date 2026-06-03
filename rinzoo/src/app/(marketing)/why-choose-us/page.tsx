import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/landing/PageHero";

export const metadata: Metadata = {
  title: "Why Choose Us — Rinzoo",
  description: "6 reasons families trust Rinzoo Detergent Powder — powerful cleaning, fabric-friendly care, long-lasting fragrance, and unbeatable value.",
};

export const revalidate = 21600;

const REASONS = [
  { num: "01", title: "Powerful Cleaning", desc: "Our advanced formula penetrates deep into fabric fibres to lift and remove even the toughest stains — oil, mud, food, and more." },
  { num: "02", title: "Fabric Friendly", desc: "Rinzoo is specially formulated to be gentle on all types of fabrics while remaining highly effective against dirt and grime." },
  { num: "03", title: "Long-Lasting Fragrance", desc: "Enjoy clothes that smell fresh all day. Our fragrance technology ensures a pleasant, long-lasting scent after every wash." },
  { num: "04", title: "Affordable Pricing", desc: "Premium cleaning doesn't have to be expensive. Rinzoo delivers outstanding results at a price every household can afford." },
  { num: "05", title: "Consistent Quality", desc: "Every batch of Rinzoo Detergent Powder is manufactured under strict quality controls to ensure consistent performance." },
  { num: "06", title: "Trusted by Families", desc: "Thousands of families across India trust Rinzoo for their daily laundry needs. Join our growing community of happy customers." },
];

export default function WhyChooseUsPage() {
  return (
    <>
      <PageHero
        badge="Why Rinzoo Is Different"
        title={<>Why Choose <span className="bg-gradient-to-r from-[#5ea3ff] to-[oklch(0.78_0.12_240)] bg-clip-text text-transparent">Rinzoo?</span></>}
        subtitle="Here's why millions of households choose Rinzoo for their laundry."
      />

      <div className="max-w-[1140px] mx-auto">
        <section className="px-5 sm:px-8 pb-16 sm:pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REASONS.map((r) => (
              <Card key={r.title} className="rounded-2xl bg-neutral-900 border border-white/10 p-7 flex flex-col gap-2">
                <span className="text-5xl font-black text-white/10 leading-none">{r.num}</span>
                <h3 className="text-lg font-extrabold text-neutral-50 mt-1">{r.title}</h3>
                <p className="text-sm text-[#a1a1a1] leading-relaxed">{r.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 sm:px-8 pb-20">
          <div className="relative bg-gradient-to-br from-[oklch(0.45_0.18_259)] via-[oklch(0.4_0.16_259)] to-[oklch(0.3_0.12_259)] shadow-2xl shadow-black/40 rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
            <div className="pointer-events-none size-64 bg-[oklch(0.62_0.19_47)]/25 blur-2xl rounded-full absolute -left-10 -top-10" />
            <div className="relative flex flex-col items-center gap-4">
              <h2 className="font-extrabold text-white text-3xl sm:text-4xl tracking-tight">Ready to make the switch?</h2>
              <p className="text-white/85">Try Rinzoo for just ₹8 today.</p>
              <Button asChild className="bg-[oklch(0.62_0.19_47)] hover:bg-[oklch(0.58_0.19_47)] shadow-lg font-bold text-white px-8 gap-2 h-12 mt-2">
                <Link href="/products"><ArrowRight className="size-5" />Explore Products</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
