import Link from "next/link";
import { Tag, Gift, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { SectionContent } from "@/lib/content-schema";

export interface OfferCard {
  title: string;
  description: string;
  type: string;
  cta?: string;
}

// 3 visual variants cycled across cards — preserves the approved design styling
const VARIANTS = [
  {
    card: "border-[oklch(0.62_0.19_47)]/40 bg-[oklch(0.62_0.19_47)]/10 border-2",
    iconBg: "bg-[oklch(0.62_0.19_47)]",
    button: "border-[oklch(0.62_0.19_47)] text-[oklch(0.78_0.16_47)] bg-transparent hover:bg-[oklch(0.62_0.19_47)]/10",
  },
  {
    card: "bg-[#2b7fff]/10 border-[#2b7fff]/40 border-2",
    iconBg: "bg-[#2b7fff]",
    button: "bg-transparent text-[#5ea3ff] border-[#2b7fff] border-2 hover:bg-[#2b7fff]/10",
  },
  {
    card: "bg-neutral-900 border border-white/10",
    iconBg: "bg-[#2b7fff]",
    button: "bg-transparent text-[#5ea3ff] border-[#2b7fff] border-2 hover:bg-[#2b7fff]/10",
  },
];

const ICONS = [Tag, Gift, Truck];

export function Offers({ offers, content }: { offers: OfferCard[]; content?: SectionContent }) {
  if (offers.length === 0) return null;
  const c = (content ?? {}) as Record<string, string>;
  const badge = c.badge || "Special Offers";
  const heading = c.heading || "Limited-Time Savings";

  return (
    <section className="px-5 sm:px-8 py-16 sm:py-20">
      <div className="text-center flex mb-12 flex-col items-center gap-3">
        <Badge className="bg-[oklch(0.62_0.19_47)]/20 text-[oklch(0.78_0.16_47)] font-semibold rounded-full text-xs leading-4 px-3 py-1">
          {badge}
        </Badge>
        <h2 className="font-extrabold text-neutral-50 text-3xl sm:text-4xl leading-tight tracking-tight">
          {heading}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.slice(0, 3).map((offer, i) => {
          const v = VARIANTS[i % 3];
          const Icon = ICONS[i % 3];
          return (
            <Card key={offer.title} className={`rounded-2xl p-6 flex flex-col gap-4 ${v.card}`}>
              <CardHeader className="p-0 gap-3">
                <div className={`size-11 rounded-xl ${v.iconBg} text-white flex justify-center items-center`}>
                  <Icon className="size-5" />
                </div>
                <CardTitle className="text-neutral-50 text-lg leading-7">{offer.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <p className="text-[#a1a1a1] text-sm leading-6">{offer.description}</p>
              </CardContent>
              <CardFooter className="p-0">
                <Button asChild variant="outline" className={`w-full ${v.button}`}>
                  <Link href="/offers">{offer.cta ?? "Claim Offer"}</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
