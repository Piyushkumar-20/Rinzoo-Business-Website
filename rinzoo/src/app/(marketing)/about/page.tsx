import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Factory, Award, Users, TrendingUp, Check, BadgeCheck, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/landing/PageHero";

export const metadata: Metadata = {
  title: "About Us — Rinzoo",
  description: "Ropox Industries, makers of Rinzoo Detergent Powder — built on trust and driven by quality. Premium-grade household care for every Indian family.",
};

export const revalidate = 21600;

const STATS = [
  { value: "50k+", label: "Happy Families" },
  { value: "100%", label: "Quality Assured" },
  { value: "500+", label: "Retail Partners" },
];

const VALUES = [
  "Premium Cleaning Performance",
  "Budget-Friendly Pricing",
  "Reliable Quality",
  "Customer Satisfaction",
  "Continuous Improvement & Innovation",
];

const DIFFERENTIATORS = [
  { icon: Factory, label: "State-of-the-art Manufacturing" },
  { icon: Award, label: "Premium Quality Standards" },
  { icon: Users, label: "Thousands of Happy Customers" },
  { icon: TrendingUp, label: "Continuously Growing Network" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        badge="About Ropox Industries"
        title={<>Built On Trust,<br /><span className="bg-gradient-to-r from-[#5ea3ff] to-[oklch(0.78_0.12_240)] bg-clip-text text-transparent">Driven By Quality</span></>}
        subtitle="Delivering high-quality, affordable cleaning solutions through our flagship brand — Rinzoo."
      />

      <div className="max-w-[1140px] mx-auto">
        {/* Who we are */}
        <section className="px-5 sm:px-8 pb-16 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            <div className="flex flex-col gap-6">
              <h2 className="font-extrabold text-neutral-50 text-3xl sm:text-4xl leading-tight tracking-tight">Who We Are</h2>
              <p className="text-[#a1a1a1] text-base leading-7">
                Ropox Industries was founded with a simple mission — to bring premium-grade household care within
                reach of every Indian family. Our focus on quality, innovation and customer satisfaction drives
                everything we do.
              </p>
              <p className="text-[#a1a1a1] text-base leading-7">
                Through our flagship brand Rinzoo, we have built a reputation for detergent powder that combines
                powerful stain removal with fabric care — at a price that makes premium cleaning accessible to all.
              </p>
              <div className="flex flex-col gap-3">
                {VALUES.map((v) => (
                  <div key={v} className="flex items-center gap-3">
                    <div className="size-7 rounded-full bg-[#2b7fff]/15 flex justify-center items-center shrink-0">
                      <Check className="size-4 text-[#5ea3ff]" />
                    </div>
                    <span className="font-medium text-neutral-50 text-sm leading-5">{v}</span>
                  </div>
                ))}
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

        {/* Stats */}
        <section className="px-5 sm:px-8 pb-16 sm:pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl bg-neutral-900 border border-white/10 flex p-8 flex-col gap-1 items-center text-center">
                <span className="font-extrabold text-[#5ea3ff] text-4xl leading-none">{s.value}</span>
                <span className="text-[#a1a1a1] text-sm leading-5 mt-2">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-neutral-800 flex p-4 items-center gap-3 mt-6">
            <BadgeCheck className="size-6 text-[#5ea3ff] shrink-0" />
            <span className="font-medium text-neutral-50 text-sm leading-5">
              Our Quality Commitment: every pack tested for consistent, reliable cleaning.
            </span>
          </div>
        </section>

        {/* What makes us different */}
        <section className="px-5 sm:px-8 pb-16 sm:pb-20">
          <div className="text-center flex mb-12 flex-col items-center gap-3">
            <Badge className="font-semibold rounded-full bg-neutral-800 text-[#5ea3ff] text-xs px-3 py-1">What Makes Us Different</Badge>
            <h2 className="font-extrabold text-neutral-50 text-3xl sm:text-4xl tracking-tight">Quality You Can Count On</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {DIFFERENTIATORS.map((d) => {
              const Icon = d.icon;
              return (
                <Card key={d.label} className="rounded-2xl bg-neutral-900 border border-white/10 p-6 flex flex-col items-center text-center gap-3">
                  <div className="size-14 rounded-2xl bg-[#2b7fff] text-white flex justify-center items-center">
                    <Icon className="size-7" />
                  </div>
                  <p className="text-sm font-semibold text-neutral-50">{d.label}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 sm:px-8 pb-20 text-center flex flex-col items-center gap-4">
          <h2 className="font-extrabold text-neutral-50 text-3xl sm:text-4xl tracking-tight">Ready to experience Rinzoo?</h2>
          <p className="text-[#a1a1a1]">Try our ₹8 trial pack today.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Button asChild className="bg-[oklch(0.62_0.19_47)] hover:bg-[oklch(0.58_0.19_47)] shadow-lg font-bold text-white px-7 gap-2 h-12">
              <Link href="/products"><ArrowRight className="size-5" />View Products</Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent font-semibold text-[#5ea3ff] border-[#2b7fff] border-2 hover:bg-[#2b7fff]/10 px-7 h-12">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
