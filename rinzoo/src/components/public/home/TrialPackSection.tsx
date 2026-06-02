"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function TrialPackSection() {
  return (
    <section className="bg-white py-16 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
              Try Rinzoo for{" "}
              <span className="text-[#e91e63]">Just ₹8</span>
            </h2>
            <p className="mt-2 text-xl font-semibold text-gray-700">
              Pasand aaye to ₹85
            </p>
            <p className="mt-4 text-gray-500 leading-relaxed max-w-md">
              Experience premium washing performance with our 90g trial pack. If
              you love the results, upgrade to the 1kg family pack for just ₹85.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center rounded-full bg-[#e91e63] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#c2185b] transition-colors shadow-lg shadow-pink-200"
            >
              View Products
            </Link>
          </motion.div>

          {/* Right — Product packs */}
          <div className="relative flex items-center justify-center h-80 lg:h-96">
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-56 w-56 rounded-full bg-pink-100 blur-3xl opacity-60" />
            </div>

            {/* "Just ₹8" badge */}
            <motion.div
              className="absolute left-6 top-4 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-[#e91e63] shadow-xl shadow-pink-300/40"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="text-center">
                <p className="text-[9px] font-semibold text-pink-100 leading-tight">Just</p>
                <p className="text-base font-extrabold text-white leading-none">₹8</p>
              </div>
            </motion.div>

            {/* Small pack */}
            <motion.div
              className="absolute left-8 bottom-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="h-40 w-28 rounded-xl bg-gradient-to-b from-[#e91e63] to-[#c2185b] shadow-2xl flex flex-col items-center justify-center p-3 border-2 border-pink-300/30">
                  <span className="text-base font-extrabold text-white" style={{ fontFamily: "cursive" }}>
                    Rinzoo
                  </span>
                  <p className="text-[8px] text-pink-100 uppercase tracking-wider">Trial Pack</p>
                  <div className="mt-2 w-full rounded-lg bg-white py-1.5 text-center">
                    <span className="text-2xl font-black text-[#e91e63]">₹8</span>
                    <p className="text-[8px] text-gray-400">90g</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Large pack */}
            <motion.div
              className="absolute right-6 bottom-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* "Just ₹85" label */}
                <div className="absolute -top-4 right-2 z-10 bg-[#0d1f4a] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                  Just ₹85
                </div>
                <div className="h-60 w-40 rounded-2xl bg-gradient-to-b from-[#1e3a7a] to-[#0d1f4a] shadow-2xl flex flex-col items-center justify-center p-4 border-2 border-blue-400/20">
                  <div className="w-full rounded-xl bg-[#e91e63] py-2 mb-3 text-center">
                    <span className="text-xl font-extrabold text-white" style={{ fontFamily: "cursive" }}>
                      Rinzoo
                    </span>
                    <p className="text-[8px] text-pink-100">KAPDO MANGA JO!</p>
                  </div>
                  <p className="text-[8px] text-blue-200 uppercase tracking-widest mb-2">
                    Detergent Powder
                  </p>
                  <div className="w-full rounded-lg bg-white/10 py-2 text-center">
                    <span className="text-3xl font-black text-white">₹85</span>
                    <p className="text-[9px] text-blue-200">Net Weight: 1kg</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
