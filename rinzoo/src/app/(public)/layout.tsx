import type { Metadata } from "next";
import { Navbar } from "@/components/public/layout/Navbar";
import { Footer } from "@/components/public/layout/Footer";
import { WhatsAppFAB } from "@/components/public/layout/WhatsAppFAB";

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://rinzoo.in";

// Default OG metadata — overridden per-page via generateMetadata or page-level export
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  openGraph: {
    siteName: "Rinzoo",
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    title: "Rinzoo — Premium Results, Smart Pricing",
    description:
      "Rinzoo Detergent Powder by Ropox Industries. Powerful cleaning, fabric-friendly freshness — at a price every household can trust. Try 90g for just ₹8.",
    images: [
      {
        url: "/images/ad-poster.jpeg",
        width: 1200,
        height: 630,
        alt: "Rinzoo Detergent Powder — Kapde Mange Jo!",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rinzoo — Premium Results, Smart Pricing",
    description: "Powerful cleaning, fabric-friendly freshness. Try 90g for just ₹8.",
    images: ["/images/ad-poster.jpeg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
