import Link from "next/link";
import { Navbar } from "@/components/public/layout/Navbar";
import { Footer } from "@/components/public/layout/Footer";
import { ArrowLeft, Package, Phone } from "lucide-react";

export default function PublicNotFound() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[#0d1f4a] pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5" />
            <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-white/5" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-9xl font-black text-[#e91e63] leading-none mb-4">404</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              This page got lost in the laundry
            </h1>
            <p className="text-gray-300 max-w-lg mx-auto mb-8">
              We couldn&apos;t find what you were looking for. The page may have moved or the link might be broken.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#e91e63] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#c2185b] transition-colors shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Homepage
            </Link>
          </div>
        </section>

        {/* Helpful links */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl font-extrabold text-gray-900 mb-8">You might be looking for:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/products", icon: Package, label: "Our Products", desc: "Explore Rinzoo packs" },
                { href: "/offers",   icon: Package, label: "Current Offers", desc: "Limited-time deals" },
                { href: "/contact",  icon: Phone,   label: "Contact Us",    desc: "We're here to help" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:border-[#e91e63]/20 transition-all"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-50">
                    <item.icon className="h-6 w-6 text-[#e91e63]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
