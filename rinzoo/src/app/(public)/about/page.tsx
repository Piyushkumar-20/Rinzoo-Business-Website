"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Factory, Award, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

const MILESTONES = [
  { icon: Factory, label: "State-of-the-art Manufacturing" },
  { icon: Award, label: "Premium Quality Standards" },
  { icon: Users, label: "Thousands of Happy Customers" },
  { icon: TrendingUp, label: "Continuously Growing Network" },
];

const VALUES = [
  "Premium Cleaning Performance",
  "Budget-Friendly Pricing",
  "Reliable Quality",
  "Customer Satisfaction",
  "Continuous Improvement & Innovation",
];

export default function AboutPage() {
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
            About <span className="text-[#e91e63]">Ropox Industries</span>
          </motion.h1>
          <motion.p
            className="mt-4 text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Dedicated to delivering high-quality and affordable cleaning solutions
            through our flagship brand — Rinzoo Detergent Powder.
          </motion.p>
        </div>
      </section>

      {/* Who we are */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-extrabold text-gray-900">Who We Are</h2>
              <p className="mt-4 text-gray-500 leading-relaxed">
                Ropox Industries is a dedicated manufacturing company focused on
                delivering high-quality and affordable cleaning solutions to every
                household. Our focus on quality, innovation and customer satisfaction
                drives everything we do.
              </p>
              <p className="mt-4 text-gray-500 leading-relaxed">
                Through our flagship brand Rinzoo, we have built a reputation for
                producing detergent powder that combines powerful stain removal with
                fabric care — all at a price point that makes premium cleaning
                accessible to every family.
              </p>
              <ul className="mt-6 space-y-3">
                {VALUES.map((v) => (
                  <li key={v} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#e91e63] shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{v}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 shadow-2xl flex items-center justify-center">
                <div className="w-4/5 space-y-3">
                  <div className="h-16 rounded-t-xl bg-gradient-to-b from-blue-200 to-blue-100" />
                  <div className="relative h-28 bg-gray-400 rounded-sm flex items-end">
                    {[0, 1, 2, 3].map((w) => (
                      <div key={w} className="absolute top-4 bg-blue-200 rounded-sm" style={{ left: `${8 + w * 22}%`, width: "14%", height: "40%" }} />
                    ))}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-12 w-10 bg-gray-600 rounded-t-sm" />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#e91e63] text-white text-xs font-bold px-3 py-1 rounded">
                      ROPOX INDUSTRIES
                    </div>
                  </div>
                  <div className="h-6 bg-green-200 rounded-b-xl" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-10">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.label}
                className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50">
                  <m.icon className="h-7 w-7 text-[#e91e63]" />
                </div>
                <p className="text-sm font-semibold text-gray-800">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
          Ready to experience Rinzoo?
        </h2>
        <p className="text-gray-500 mb-6">Try our ₹8 trial pack today.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/products" className="rounded-full bg-[#e91e63] px-8 py-3 text-sm font-bold text-white hover:bg-[#c2185b] transition-colors">
            View Products
          </Link>
          <Link href="/contact" className="rounded-full border-2 border-[#0d1f4a] px-8 py-3 text-sm font-bold text-[#0d1f4a] hover:bg-[#0d1f4a] hover:text-white transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
