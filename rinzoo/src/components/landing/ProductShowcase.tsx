import Link from "next/link";
import Image from "next/image";
import { Check, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";

export interface Pack {
  badgeText: string;
  title: string;
  price: string;
  desc: string;
  features: string[];
  image: string;
  highlight: boolean;
}

export function ProductShowcase({ packs }: { packs: Pack[] }) {
  return (
    <section className="px-5 sm:px-8 py-16 sm:py-20">
      <div className="text-center flex mb-12 flex-col items-center gap-3">
        <Badge className="font-semibold rounded-full bg-neutral-800 text-[#5ea3ff] text-xs leading-4 px-3 py-1">
          Product Showcase
        </Badge>
        <h2 className="font-extrabold text-neutral-50 text-3xl sm:text-4xl leading-tight tracking-tight">
          Choose Your Rinzoo Pack
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {packs.map((pack) => (
          <Card
            key={pack.title}
            className={`relative rounded-3xl bg-neutral-900 p-0 gap-0 overflow-hidden flex flex-col ${
              pack.highlight
                ? "shadow-xl shadow-black/40 border-2 border-[#2b7fff]"
                : "border border-white/10"
            }`}
          >
            {pack.highlight && (
              <Badge className="z-10 font-bold rounded-full bg-[#2b7fff] text-white text-xs leading-4 absolute right-5 top-5 px-3 py-1">
                Best Value
              </Badge>
            )}
            <div className="flex flex-col sm:flex-row p-6 gap-6 flex-1">
              <div className="shrink-0 mx-auto sm:mx-0 relative rounded-2xl w-40 h-52 overflow-hidden">
                <Image src={pack.image} alt={pack.title} fill sizes="160px" className="object-cover" />
              </div>
              <div className="flex flex-col gap-3">
                <Badge
                  className={`font-bold rounded-full text-xs leading-4 px-2.5 py-0.5 w-fit ${
                    pack.highlight
                      ? "bg-neutral-800 text-[#5ea3ff]"
                      : "bg-[oklch(0.62_0.19_47)]/20 text-[oklch(0.78_0.16_47)]"
                  }`}
                >
                  {pack.badgeText}
                </Badge>
                <h3 className="font-extrabold text-neutral-50 text-2xl leading-8">{pack.title}</h3>
                <div className="items-baseline flex gap-1">
                  <span className="font-extrabold text-[#5ea3ff] text-4xl leading-10">{pack.price}</span>
                </div>
                <p className="text-[#a1a1a1] text-sm leading-6">{pack.desc}</p>
                <div className="flex mt-1 flex-col gap-1.5">
                  {pack.features.map((f) => (
                    <span key={f} className="text-neutral-50 text-sm leading-5 flex items-center gap-2">
                      <Check className="size-4 text-[#5ea3ff] shrink-0" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <CardFooter className="border-t border-white/10 px-6 pt-4 pb-6">
              <Button
                asChild
                className={`font-semibold text-white gap-2 w-full ${
                  pack.highlight ? "bg-[#2b7fff] hover:bg-[#2b7fff]/90" : "bg-[oklch(0.62_0.19_47)] hover:bg-[oklch(0.58_0.19_47)]"
                }`}
              >
                <Link href="/contact">
                  <ShoppingCart className="size-4" />
                  Buy {pack.title.split(" ")[0]} for {pack.price}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
