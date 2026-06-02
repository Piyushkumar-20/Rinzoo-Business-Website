"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const REASONS = [
  {
    title: "Powerful Cleaning",
    desc: "Our advanced formula penetrates deep into fabric fibres to lift and remove even the toughest stains — oil, mud, food, and more.",
    color: "from-pink-50 to-rose-50",
    num: "01",
  },
  {
    title: "Fabric Friendly",
    desc: "Rinzoo is specially formulated to be gentle on all types of fabrics while remaining highly effective against dirt and grime.",
    color: "from-blue-50 to-indigo-50",
    num: "02",
  },
  {
    title: "Long-Lasting Fragrance",
    desc: "Enjoy clothes that smell fresh all day. Our fragrance technology ensures a pleasant, long-lasting scent after every wash.",
    color: "from-purple-50 to-violet-50",
    num: "03",
  },
  {
    title: "Affordable Pricing",
    desc: "Premium cleaning doesn't have to be expensive. Rinzoo delivers outstanding results at a price every household can afford.",
    color: "from-green-50 to-emerald-50",
    num: "04",
  },
  {
    title: "Consistent Quality",
    desc: "Every batch of Rinzoo Detergent Powder is manufactured under strict quality controls to ensure consistent performance.",
    color: "from-amber-50 to-yellow-50",
    num: "05",
  },
  {
    title: "Trusted by Families",
    desc: "Thousands of families across India trust Rinzoo for their daily laundry needs. Join our growing community of happy customers.",
    color: "from-teal-50 to-cyan-50",
    num: "06",
  },
];

export default function WhyChooseUsPage() {
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
            Why Choose <span className="text-[#e91e63]">Rinzoo?</span>
          </motion.h1>
          <motion.p
            className="mt-4 text-gray-300 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Here&apos;s why millions of households choose Rinzoo for their laundry.
          </motion.p>
        </div>
      </section>

      {/* Reasons grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REASONS.map((r, i) => (
              <motion.div
                key={r.title}
                className={`rounded-2xl bg-gradient-to-br ${r.color} p-7 border border-gray-100`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <span className="text-5xl font-black text-gray-100">{r.num}</span>
                <h3 className="text-lg font-extrabold text-gray-900 mt-2">{r.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d1f4a] py-16 text-center">
        <h2 className="text-2xl font-extrabold text-white mb-3">
          Ready to make the switch?
        </h2>
        <p className="text-gray-300 mb-6">Try Rinzoo for just ₹8 today.</p>
        <Link href="/products" className="rounded-full bg-[#e91e63] px-10 py-3.5 text-sm font-bold text-white hover:bg-[#c2185b] transition-colors">
          Explore Products →
        </Link>
      </section>
    </>
  );
}
