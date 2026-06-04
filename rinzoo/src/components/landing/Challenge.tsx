import Link from "next/link";
import Image from "next/image";
import { Zap, Check, ArrowRight, MoveRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SectionContent } from "@/lib/content-schema";

const POINTS = [
  "Risk-free trial — just ₹8",
  "Experience premium clean firsthand",
  "Upgrade only if you love it",
];

export function Challenge({ content }: { content?: SectionContent }) {
  const c = (content ?? {}) as Record<string, string>;
  const badge = c.badge || "The ₹8 Challenge";
  const heading = c.heading || "Pehle ₹8,";
  const highlight = c.highlight || "Pasand Aaye To ₹85";
  const description = c.description || "Try the 90g pack for just ₹8. Experience the quality yourself. Upgrade to the 1kg family pack if you love the results.";
  const btnText = c.btnText || "Take the ₹8 Challenge";
  const btnLink = c.btnLink || "/products";
  const image1 = c.image1 || "/images/pack-compare.jpeg";
  const image2 = c.image2 || "/images/image.png";

  return (
    <section className="relative p-5 sm:p-8 overflow-hidden">
      <div className="relative bg-gradient-to-br from-[oklch(0.45_0.18_259)] via-[oklch(0.4_0.16_259)] to-[oklch(0.3_0.12_259)] shadow-2xl shadow-black/40 rounded-3xl p-6 sm:p-12 overflow-hidden">
        <div className="pointer-events-none size-64 bg-[oklch(0.62_0.19_47)]/25 blur-2xl rounded-full absolute -right-10 -top-10" />
        <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          {/* Copy */}
          <div className="text-white flex flex-col gap-6">
            <Badge className="bg-[oklch(0.62_0.19_47)] font-bold rounded-full text-white text-xs leading-4 px-3 py-1 gap-1.5 w-fit">
              <Zap className="size-3.5" />
              {badge}
            </Badge>
            <h2 className="font-extrabold text-4xl sm:text-5xl leading-[1.05] tracking-tight">
              {heading}
              <br />
              <span className="text-[oklch(0.82_0.16_70)]">{highlight}</span>
            </h2>
            <p className="max-w-md text-white/85 text-base leading-7">
              {description}
            </p>
            <div className="flex flex-col gap-3">
              {POINTS.map((p) => (
                <div key={p} className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-white/20 flex justify-center items-center shrink-0">
                    <Check className="size-4 text-white" />
                  </div>
                  <span className="font-medium text-white text-base leading-6">{p}</span>
                </div>
              ))}
            </div>
            <Button asChild className="bg-[oklch(0.62_0.19_47)] hover:bg-[oklch(0.58_0.19_47)] shadow-lg font-bold text-white text-base leading-6 mt-2 px-7 gap-2 w-fit h-12">
              <Link href={btnLink}>
                <ArrowRight className="size-5" />
                {btnText}
              </Link>
            </Button>
          </div>

          {/* Pack comparison */}
          <div className="flex justify-center items-center gap-3 sm:gap-4">
            {[
              { label: "90g Trial", price: "₹8" },
            ].map((p) => (
              <div key={p.label} className="shadow-xl shadow-black/40 rounded-2xl bg-neutral-900 flex p-4 sm:p-6 flex-col items-center gap-3">
                <div className="relative rounded-xl w-24 sm:w-28 h-36 sm:h-40 overflow-hidden">
                  <Image src={image1} alt="90g pack" fill sizes="112px" className="object-cover" />
                </div>
                <span className="font-semibold text-[#a1a1a1] text-sm leading-5">{p.label}</span>
                <span className="font-extrabold text-[#5ea3ff] text-3xl leading-9">{p.price}</span>
              </div>
            ))}
            <MoveRight className="size-6 sm:size-8 text-white/70 shrink-0" />
            <div className="shadow-xl shadow-black/40 rounded-2xl bg-neutral-900 flex p-4 sm:p-6 flex-col items-center gap-3">
              <div className="relative rounded-xl w-24 sm:w-28 h-36 sm:h-40 overflow-hidden">
                <Image src={image2} alt="1kg pack" fill sizes="112px" className="object-cover" />
              </div>
              <span className="font-semibold text-[#a1a1a1] text-sm leading-5">1kg Family</span>
              <span className="font-extrabold text-[#5ea3ff] text-3xl leading-9">₹85</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
