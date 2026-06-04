import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShoppingBag, Handshake, ShieldCheck, Users, IndianRupee, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SectionContent } from "@/lib/content-schema";

export function Hero({ content }: { content?: SectionContent }) {
  // DB content with safe fallback to the approved defaults
  const c = (content ?? {}) as Record<string, string>;
  const badge = c.badge || "Premium Results, Smart Pricing";
  const heading = c.heading || "Premium Results.";
  const highlight = c.highlight || "Smart Pricing.";
  const description = c.description || "Powerful stain removal, long-lasting freshness, and reliable cleaning performance for every household.";
  const primaryBtnText = c.primaryBtnText || "Try Rinzoo Today";
  const primaryBtnLink = c.primaryBtnLink || "/products";
  const secondaryBtnText = c.secondaryBtnText || "Become a Distributor";
  const secondaryBtnLink = c.secondaryBtnLink || "/distributor";
  const productImage1 = c.productImage1 || "/images/pack-compare.jpeg";
  const productImage2 = c.productImage2 || "/images/pack-compare.jpeg";
  const backgroundImage = c.backgroundImage || "";

  return (
    <section className="relative px-5 sm:px-8 pt-12 sm:pt-16 pb-16 sm:pb-20 overflow-hidden">
      {backgroundImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={backgroundImage} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" />
      )}
      <div className="pointer-events-none size-96 blur-3xl rounded-full bg-[#2b7fff]/15 absolute -right-24 top-10" />
      <div className="pointer-events-none size-72 bg-[oklch(0.62_0.19_47)]/15 blur-3xl rounded-full absolute -left-20 bottom-0" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        {/* Copy */}
        <div className="flex flex-col gap-6">
          <Badge className="font-semibold rounded-full bg-neutral-800 text-[#5ea3ff] text-xs leading-4 px-3 py-1 gap-1.5 w-fit">
            <Sparkles className="size-3.5" />
            {badge}
          </Badge>
          <h1 className="font-extrabold text-neutral-50 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
            {heading}
            <br />
            <span className="bg-gradient-to-r from-[#5ea3ff] to-[oklch(0.78_0.12_240)] bg-clip-text text-transparent">
              {highlight}
            </span>
          </h1>
          <p className="max-w-md text-[#a1a1a1] text-base leading-7">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button asChild className="bg-[oklch(0.62_0.19_47)] hover:bg-[oklch(0.58_0.19_47)] shadow-lg shadow-[oklch(0.62_0.19_47)]/30 font-semibold text-white text-base leading-6 px-6 gap-2 h-12">
              <Link href={primaryBtnLink}>
                <ShoppingBag className="size-5" />
                {primaryBtnText}
              </Link>
            </Button>
            <Button asChild className="bg-transparent font-semibold text-[#5ea3ff] border-[#2b7fff] border-2 hover:bg-[#2b7fff]/10 px-6 gap-2 h-12" variant="outline">
              <Link href={secondaryBtnLink}>
                <Handshake className="size-5" />
                {secondaryBtnText}
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap mt-2 items-center gap-x-6 gap-y-3">
            {[
              { icon: ShieldCheck, label: "Trusted Quality" },
              { icon: Users, label: "50k+ Families" },
              { icon: IndianRupee, label: "Best Value" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="size-9 rounded-full bg-neutral-800 text-[#5ea3ff] flex justify-center items-center">
                  <Icon className="size-5" />
                </div>
                <span className="font-medium text-neutral-50 text-sm leading-5">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product visuals */}
        <div className="relative flex justify-center items-center">
          <div className="size-80 bg-gradient-to-br from-[#2b7fff]/25 to-neutral-800 rounded-full absolute inset-0 m-auto" />
          <div className="relative grid grid-cols-2 gap-4">
            {[
              { label: "90g · ₹8", mt: "mt-8", img: productImage1 },
              { label: "1kg · ₹85", mt: "", img: productImage2 },
            ].map((p) => (
              <div key={p.label} className={`shadow-2xl shadow-black/40 rounded-3xl bg-neutral-900 border border-white/10 overflow-hidden ${p.mt}`}>
                <div className="relative w-36 sm:w-44 h-56 sm:h-64">
                  <Image
                    src={p.img}
                    alt={`Rinzoo ${p.label} pack`}
                    fill
                    sizes="(max-width: 640px) 144px, 176px"
                    className="object-cover"
                    priority
                  />
                  <div className="bg-gradient-to-t from-[oklch(0.3_0.12_259)] to-transparent absolute inset-x-0 bottom-0 p-3">
                    <span className="font-bold text-white text-sm leading-5">{p.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="shadow-xl shadow-black/40 rounded-2xl bg-neutral-900 border border-white/10 flex absolute right-2 sm:right-4 -bottom-2 px-4 py-3 items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-[oklch(0.62_0.19_47)] text-[oklch(0.62_0.19_47)]" />
              ))}
            </div>
            <span className="font-semibold text-neutral-50 text-sm leading-5">4.8 · 12k Reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
