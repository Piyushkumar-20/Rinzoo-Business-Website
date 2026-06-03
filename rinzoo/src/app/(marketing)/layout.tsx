import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://rinzoo.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Rinzoo — Premium Results, Smart Pricing",
  description:
    "Rinzoo Detergent Powder by Ropox Industries. Powerful stain removal, long-lasting freshness and reliable cleaning — try the 90g pack for just ₹8.",
  openGraph: {
    siteName: "Rinzoo",
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    title: "Rinzoo — Premium Results, Smart Pricing",
    description:
      "Powerful stain removal, long-lasting freshness and reliable cleaning performance for every household. Try 90g for just ₹8.",
    images: [{ url: "/images/ad-poster.jpeg", width: 1200, height: 630, alt: "Rinzoo Detergent Powder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rinzoo — Premium Results, Smart Pricing",
    description: "Powerful cleaning, long-lasting freshness. Try 90g for just ₹8.",
    images: ["/images/ad-poster.jpeg"],
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col">
      <LandingHeader />
      <div className="flex-1">{children}</div>
      <LandingFooter />
    </div>
  );
}
