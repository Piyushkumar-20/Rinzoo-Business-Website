"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const PRODUCTS = [
  {
    name: "Rinzoo Detergent Powder",
    tagline: "The #1 Duo Clothes Washing Powder",
    features: ["Removes tough stains", "Fabric friendly", "Long-lasting freshness", "Budget-friendly"],
    variants: [
      { size: "90g", price: "₹8", label: "Trial Pack", color: "bg-[#e91e63]" },
      { size: "1kg", price: "₹85", label: "Family Pack", color: "bg-[#0d1f4a]" },
    ],
  },
];

export default function ProductsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0d1f4a] pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl font-extrabold text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our <span className="text-[#e91e63]">Products</span>
          </motion.h1>
          <motion.p
            className="mt-4 text-gray-300 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Premium cleaning at a price every household can trust.
          </motion.p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {PRODUCTS.map((product, pi) => (
            <motion.div
              key={product.name}
              className="rounded-3xl border border-gray-100 shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: pi * 0.1 }}
            >
              {/* Product header */}
              <div className="bg-gradient-to-r from-[#0d1f4a] to-[#1e3a7a] p-8">
                <h2 className="text-2xl font-extrabold text-white">{product.name}</h2>
                <p className="text-[#e91e63] font-semibold mt-1">{product.tagline}</p>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-50">
                {/* Product image */}
                <div className="flex items-center justify-center">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/image.png"
                      alt="Rinzoo Detergent Powder 1kg Pack"
                      width={220}
                      height={280}
                      className="w-[180px] h-auto object-cover"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#e91e63] shrink-0" />
                        <span className="text-sm text-gray-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Variants */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Available Packs</h3>
                  <div className="space-y-3">
                    {product.variants.map((v) => (
                      <div
                        key={v.size}
                        className={`${v.color} rounded-2xl p-5 flex items-center justify-between text-white shadow-md`}
                      >
                        <div>
                          <p className="font-bold text-lg">{v.price}</p>
                          <p className="text-sm opacity-90">{v.size} — {v.label}</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-xl font-extrabold">
                          {v.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trial CTA */}
      <section className="bg-[#0d1f4a] py-16 text-center">
        <h2 className="text-2xl font-extrabold text-white mb-3">
          Start with just ₹8
        </h2>
        <p className="text-gray-300 mb-6 max-w-md mx-auto">
          Try our 90g trial pack and experience the Rinzoo difference.
        </p>
        <Link href="/contact" className="rounded-full bg-[#e91e63] px-10 py-3.5 text-sm font-bold text-white hover:bg-[#c2185b] transition-colors">
          Contact Us to Order →
        </Link>
      </section>
    </>
  );
}
