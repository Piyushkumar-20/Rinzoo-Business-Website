"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "tween" as const, duration: 0.6, delay },
});

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0d1f4a] flex items-center pt-16">
      {/* Decorative background circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute top-1/3 -right-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/4 -translate-y-1/2 rounded-full bg-blue-400/5" />
        {/* Bubble dots */}
        {[
          { top: "20%", left: "55%", size: 8 },
          { top: "35%", left: "62%", size: 12 },
          { top: "60%", left: "48%", size: 6 },
          { top: "15%", right: "15%", size: 10 },
          { bottom: "25%", left: "60%", size: 8 },
        ].map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{ ...b, width: b.size, height: b.size }}
            animate={{ y: [0, -12, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
          {/* Left — Copy */}
          <div className="flex flex-col justify-center">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
              {...fadeUp(0.1)}
            >
              <span className="text-white">Premium Results,</span>
              <br />
              <span className="text-[#e91e63]">Smart Pricing</span>
            </motion.h1>

            <motion.p
              className="mt-5 text-base sm:text-lg text-gray-300 max-w-md leading-relaxed"
              {...fadeUp(0.25)}
            >
              Rinzoo Detergent Powder delivers powerful cleaning, long-lasting
              freshness and reliable results — at a price every household can
              trust.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              {...fadeUp(0.4)}
            >
              <Link
                href="/products"
                className="inline-flex items-center rounded-full bg-[#e91e63] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#c2185b] transition-colors shadow-lg shadow-pink-900/30"
              >
                Explore Products
              </Link>
              <Link
                href="/distributor"
                className="inline-flex items-center rounded-full border-2 border-white px-7 py-3.5 text-sm font-bold text-white hover:bg-white hover:text-[#0d1f4a] transition-colors"
              >
                Become a Distributor
              </Link>
            </motion.div>
          </div>

          {/* Right — Product images */}
          <div className="relative flex items-center justify-center lg:justify-end h-[420px] lg:h-[540px]">
            {/* Glowing backdrop */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
            </div>

            {/* Large pack (₹85) */}
            <motion.div
              className="absolute right-4 lg:right-0 bottom-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative">
                  {/* Price badge */}
                  <div className="absolute -top-4 -right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#e91e63] shadow-lg">
                    <span className="text-xs font-extrabold text-white leading-tight text-center">
                      ₹85/<br />
                      <span className="text-[8px]">1kg</span>
                    </span>
                  </div>
                  {/* Product box visual */}
                  <div className="h-64 w-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 relative bg-gradient-to-b from-[#1e3a7a] to-[#0d1f4a]">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      {/* Rinzoo branding on pack */}
                      <div className="w-full rounded-xl bg-[#e91e63] py-2 mb-3 text-center">
                        <span className="text-xl font-extrabold text-white" style={{ fontFamily: "cursive" }}>
                          Rinzoo
                        </span>
                        <p className="text-[8px] text-pink-100">KAPDO MANGA JO!</p>
                      </div>
                      <p className="text-xs text-blue-200 text-center font-medium uppercase tracking-widest mb-2">
                        Detergent Powder
                      </p>
                      <div className="w-full rounded-lg bg-white/10 py-2 text-center">
                        <span className="text-2xl font-black text-white">₹85</span>
                        <p className="text-[10px] text-blue-200">Net Weight: 1kg</p>
                      </div>
                      <div className="mt-2 flex gap-1">
                        {["Powerful", "Fresh", "Safe"].map((t) => (
                          <span key={t} className="rounded-full bg-white/10 px-1.5 py-0.5 text-[8px] text-blue-100">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Small pack (₹8) */}
            <motion.div
              className="absolute left-4 lg:left-8 top-12"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative">
                  {/* Price badge */}
                  <div className="absolute -top-3 -left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
                    <span className="text-xs font-extrabold text-[#e91e63] leading-tight text-center">
                      ₹8/<br />
                      <span className="text-[8px] text-gray-500">90g</span>
                    </span>
                  </div>
                  {/* Product box visual */}
                  <div className="h-44 w-32 rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 relative bg-gradient-to-b from-[#e91e63] to-[#c2185b]">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                      <div className="w-full rounded-lg bg-white/20 py-1.5 mb-2 text-center">
                        <span className="text-base font-extrabold text-white" style={{ fontFamily: "cursive" }}>
                          Rinzoo
                        </span>
                      </div>
                      <p className="text-[8px] text-pink-100 text-center uppercase tracking-widest mb-2">
                        Trial Pack
                      </p>
                      <div className="w-full rounded-lg bg-white py-1.5 text-center">
                        <span className="text-xl font-black text-[#e91e63]">₹8</span>
                        <p className="text-[8px] text-gray-500">90g</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
