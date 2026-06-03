import Image from "next/image";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function WhyDifferent() {
  return (
    <section className="px-5 sm:px-8 py-16 sm:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        <div className="relative shadow-xl shadow-black/40 rounded-3xl overflow-hidden h-80 order-last lg:order-first">
          <Image
            src="https://images.unsplash.com/photo-1635274605638-d44babc08a4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHdoaXRlJTIwZm9sZGVkJTIwY2xvdGhlcyUyMGxhdW5kcnl8ZW58MXwwfHx8MTc4MDUwMjE4Mnww&ixlib=rb-4.1.0&q=80&w=800"
            alt="Clean folded laundry"
            fill
            sizes="(max-width: 1024px) 100vw, 540px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-6">
          <Badge className="font-semibold rounded-full bg-neutral-800 text-[#5ea3ff] text-xs leading-4 px-3 py-1 w-fit">
            Why Rinzoo Is Different
          </Badge>
          <h2 className="font-extrabold text-neutral-50 text-3xl sm:text-4xl leading-tight tracking-tight">
            Premium Clean,
            <br />
            Without Premium Pricing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="rounded-2xl bg-neutral-800 border border-white/10 p-6 flex flex-col gap-3">
              <CardHeader className="p-0 gap-1">
                <span className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wide">
                  Premium Brands
                </span>
              </CardHeader>
              <CardContent className="p-0 flex flex-col gap-2">
                {["High price per wash", "Out of reach for many", "No low-cost trial"].map((t) => (
                  <p key={t} className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-2">
                    <X className="size-4 text-[#ff6467] shrink-0" />
                    {t}
                  </p>
                ))}
              </CardContent>
            </Card>
            <Card className="rounded-2xl bg-neutral-900 border-2 border-[#2b7fff] p-6 flex flex-col gap-3">
              <CardHeader className="p-0 gap-1">
                <span className="font-semibold uppercase text-[#5ea3ff] text-xs leading-4 tracking-wide">
                  Rinzoo
                </span>
              </CardHeader>
              <CardContent className="p-0 flex flex-col gap-2">
                {["Best value per wash", "Affordable for every family", "₹8 risk-free trial"].map((t) => (
                  <p key={t} className="font-medium text-neutral-50 text-sm leading-5 flex items-center gap-2">
                    <Check className="size-4 text-[#5ea3ff] shrink-0" />
                    {t}
                  </p>
                ))}
              </CardContent>
            </Card>
          </div>
          <p className="text-[#a1a1a1] text-base leading-7">
            Same powerful results you expect from premium brands — at a price that respects your budget.
          </p>
        </div>
      </div>
    </section>
  );
}
