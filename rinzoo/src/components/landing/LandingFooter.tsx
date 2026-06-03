import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919911982666";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/why-choose-us", label: "Why Rinzoo" },
  { href: "/offers", label: "Offers" },
  { href: "/distributor", label: "Become a Distributor" },
  { href: "/contact", label: "Contact" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950">
      <div className="max-w-[1140px] mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-xl bg-[#2b7fff] flex justify-center items-center overflow-hidden">
                <Image src="/images/logo.png" alt="Rinzoo logo" width={40} height={40} className="object-cover w-full h-full" />
              </div>
              <div className="leading-none flex flex-col">
                <span className="font-extrabold text-[#5ea3ff] text-xl leading-7 tracking-tight">Rinzoo</span>
                <span className="font-medium uppercase text-[#a1a1a1] text-[10px] tracking-widest">by Ropox Industries</span>
              </div>
            </div>
            <p className="text-sm text-[#a1a1a1] leading-relaxed max-w-xs">
              Premium detergent powder by Ropox Industries. Powerful cleaning, fabric-friendly freshness — at a
              price every household can trust.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1a1] mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-neutral-300 hover:text-[#5ea3ff] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1a1] mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#5ea3ff] shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-300">
                  KH NO 3/18, PL NO 79, Nangloi,<br />Kotla Vihar Phase 1, New Delhi
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#5ea3ff] shrink-0" />
                <a href={`tel:+${WHATSAPP_NUMBER}`} className="text-sm text-neutral-300 hover:text-white transition-colors">
                  +91 99119 82666
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#5ea3ff] shrink-0" />
                <a href="mailto:ropoxindustry11@gmail.com" className="text-sm text-neutral-300 hover:text-white transition-colors">
                  ropoxindustry11@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Partner CTA */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1a1] mb-4">Partner With Us</h3>
            <p className="text-sm text-neutral-300 mb-4">
              Join the Rinzoo distributor network. Excellent margins, timely support, trusted brand.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/distributor"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#2b7fff] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2b7fff]/90 transition-colors"
              >
                Join Now →
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25d366] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1140px] mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#a1a1a1]">© {new Date().getFullYear()} Ropox Industries. All rights reserved.</p>
          <p className="text-xs text-[#a1a1a1]">Rinzoo — Premium Results, Smart Pricing</p>
        </div>
      </div>
    </footer>
  );
}
