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

          {/* Right — Product image */}
          <div className="relative flex items-center justify-center lg:justify-end h-[420px] lg:h-[540px]">
            {/* Glowing backdrop */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Price badges */}
                <div className="absolute -top-4 -left-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg shadow-white/30">
                  <span className="text-xs font-extrabold text-[#e91e63] leading-tight text-center">
                    ₹8/<br />
                    <span className="text-[8px] text-gray-500">90g</span>
                  </span>
                </div>
                <div className="absolute -top-4 -right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#e91e63] shadow-lg shadow-pink-900/40">
                  <span className="text-xs font-extrabold text-white leading-tight text-center">
                    ₹85/<br />
                    <span className="text-[8px]">1kg</span>
                  </span>
                </div>

                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
                  <Image
                    src="/images/pack-compare.jpeg"
                    alt="Rinzoo Detergent Powder — Trial Pack ₹8 and Family Pack ₹85"
                    width={420}
                    height={420}
                    className="w-[280px] sm:w-[340px] lg:w-[380px] h-auto object-cover"
                    priority
                  />
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
