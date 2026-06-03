import { Sparkles, Flower2, Shirt, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Sparkles,
    iconBg: "bg-[#2b7fff]",
    title: "Powerful Stain Removal",
    desc: "Tough on the hardest stains — oil, mud, food and more — gentle on your effort.",
  },
  {
    icon: Flower2,
    iconBg: "bg-[#2b7fff]",
    title: "Fresh Fragrance",
    desc: "Long-lasting freshness that keeps clothes smelling clean all day long.",
  },
  {
    icon: Shirt,
    iconBg: "bg-[#2b7fff]",
    title: "Fabric Friendly",
    desc: "Protects colours and fibres so your favourite clothes last longer, wash after wash.",
  },
  {
    icon: IndianRupee,
    iconBg: "bg-[oklch(0.62_0.19_47)]",
    title: "Affordable Pricing",
    desc: "Premium-grade detergent at a price every value-conscious family can trust.",
  },
];

export function Features() {
  return (
    <section className="px-5 sm:px-8 py-16 sm:py-20">
      <div className="text-center flex mb-12 flex-col items-center gap-3">
        <Badge className="font-semibold rounded-full bg-neutral-800 text-[#5ea3ff] text-xs leading-4 px-3 py-1">
          Why Families Choose Rinzoo
        </Badge>
        <h2 className="font-extrabold text-neutral-50 text-3xl sm:text-4xl leading-tight tracking-tight">
          Premium Performance, Every Wash
        </h2>
        <p className="max-w-xl text-[#a1a1a1] text-base leading-7">
          Engineered for Indian households that want the best clean without overspending.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <Card key={f.title} className="rounded-2xl bg-neutral-900 border border-white/10 p-6 flex flex-col gap-4">
              <CardHeader className="p-0 gap-3">
                <div className={`size-12 rounded-xl ${f.iconBg} text-white flex justify-center items-center`}>
                  <Icon className="size-6" />
                </div>
                <CardTitle className="text-neutral-50 text-lg leading-7">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-[#a1a1a1] text-sm leading-6">{f.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
