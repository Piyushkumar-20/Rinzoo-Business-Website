import Link from "next/link";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";

export function Footer() {
  return (
    <footer className="bg-[#0d1f4a] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <span
                className="text-2xl font-extrabold"
                style={{ color: "#e91e63", fontFamily: "cursive" }}
              >
                Rinzoo
              </span>
              <p className="text-[10px] text-gray-400 tracking-widest mt-0.5">
                KAPDO MANGA JO!
              </p>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
              Premium detergent powder by Ropox Industries. Powerful cleaning,
              fabric-friendly, long-lasting freshness — at a price every household
              can trust.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/products", label: "Products" },
                { href: "/why-choose-us", label: "Why Choose Us" },
                { href: "/offers", label: "Offers" },
                { href: "/distributor", label: "Become a Distributor" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-300 hover:text-[#e91e63] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#e91e63] shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">
                  Ropox Industries, India
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#e91e63] shrink-0" />
                <a
                  href={`tel:+${WHATSAPP_NUMBER}`}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#e91e63] shrink-0" />
                <a
                  href="mailto:info@rinzoo.in"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  info@rinzoo.in
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-1 rounded-full bg-[#25d366] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>

          {/* Distributor CTA */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Partner With Us
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Join the Rinzoo distributor network. Excellent margins, timely
              support, trusted brand.
            </p>
            <Link
              href="/distributor"
              className="inline-flex items-center gap-1.5 rounded-full border border-white px-5 py-2 text-sm font-semibold text-white hover:bg-white hover:text-[#0d1f4a] transition-colors"
            >
              Join Now →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Ropox Industries. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Rinzoo — Premium Results, Smart Pricing
          </p>
        </div>
      </div>
    </footer>
  );
}
