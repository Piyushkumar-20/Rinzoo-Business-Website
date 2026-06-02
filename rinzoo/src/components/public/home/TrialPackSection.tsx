"use client";

import Link from "next/link";
import Image from "next/image";
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

          {/* Right — Product image */}
          <div className="relative flex items-center justify-center h-80 lg:h-96">
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-56 w-56 rounded-full bg-pink-100 blur-3xl opacity-60" />
            </div>

            {/* Pulsing ₹8 badge */}
            <motion.div
              className="absolute left-2 top-2 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-[#e91e63] shadow-xl shadow-pink-300/40"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="text-center">
                <p className="text-[9px] font-semibold text-pink-100 leading-tight">Just</p>
                <p className="text-base font-extrabold text-white leading-none">₹8</p>
              </div>
            </motion.div>

            {/* ₹85 badge */}
            <div className="absolute right-2 top-2 z-20 bg-[#0d1f4a] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              ₹85 / 1kg
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                  <Image
                    src="/images/pack-compare.jpeg"
                    alt="Rinzoo Trial Pack ₹8 and Family Pack ₹85"
                    width={360}
                    height={360}
                    className="w-[240px] sm:w-[280px] lg:w-[320px] h-auto object-cover"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
