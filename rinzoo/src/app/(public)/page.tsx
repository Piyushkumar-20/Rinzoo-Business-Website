import type { Metadata } from "next";
import { HeroSection } from "@/components/public/home/HeroSection";
import { FeaturesBar } from "@/components/public/home/FeaturesBar";
import { TrialPackSection } from "@/components/public/home/TrialPackSection";
import { AboutSection } from "@/components/public/home/AboutSection";
import { DistributorCTA } from "@/components/public/home/DistributorCTA";

export const metadata: Metadata = {
  title: "Rinzoo — Premium Results, Smart Pricing",
  description:
    "Rinzoo Detergent Powder by Ropox Industries. Powerful cleaning, fabric-friendly, long-lasting freshness at a price every household can trust.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesBar />
      <TrialPackSection />
      <AboutSection />
      <DistributorCTA />
    </>
  );
}
