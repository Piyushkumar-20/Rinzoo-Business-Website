import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STATS = [
  { value: "50k+", label: "Happy Families" },
  { value: "100%", label: "Quality Assured" },
  { value: "500+", label: "Retail Partners" },
];

export function About() {
  return (
    <section className="px-5 sm:px-8 py-16 sm:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        <div className="flex flex-col gap-6">
          <Badge className="font-semibold rounded-full bg-neutral-800 text-[#5ea3ff] text-xs leading-4 px-3 py-1 w-fit">
            About Ropox Industries
          </Badge>
          <h2 className="font-extrabold text-neutral-50 text-3xl sm:text-4xl leading-tight tracking-tight">
            Built On Trust,
            <br />
            Driven By Quality
          </h2>
          <p className="text-[#a1a1a1] text-base leading-7">
            Ropox Industries was founded with a simple mission — to bring premium-grade household care within
            reach of every Indian family. Rinzoo is our flagship promise: world-class cleaning performance
            manufactured to the highest quality standards.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl bg-neutral-900 border border-white/10 flex p-4 sm:p-6 flex-col gap-1">
                <span className="font-extrabold text-[#5ea3ff] text-2xl sm:text-3xl leading-9">{s.value}</span>
                <span className="text-[#a1a1a1] text-xs sm:text-sm leading-5">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-neutral-800 flex p-4 items-center gap-3">
            <BadgeCheck className="size-6 text-[#5ea3ff] shrink-0" />
            <span className="font-medium text-neutral-50 text-sm leading-5">
              Our Quality Commitment: every pack tested for consistent, reliable cleaning.
            </span>
          </div>
        </div>
        <div className="relative shadow-xl shadow-black/40 rounded-3xl overflow-hidden h-80">
          <Image
            src="https://images.unsplash.com/photo-1610891015188-5369212db097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxkZXRlcmdlbnQlMjBmYWN0b3J5JTIwbWFudWZhY3R1cmluZ3xlbnwxfDB8fHwxNzgwNTAyMTgyfDA&ixlib=rb-4.1.0&q=80&w=800"
            alt="Ropox manufacturing"
            fill
            sizes="(max-width: 1024px) 100vw, 540px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
