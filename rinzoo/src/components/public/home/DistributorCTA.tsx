"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const BENEFITS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    label: "Attractive Margins",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
    label: "Timely Support",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22,4 12,14.01 9,11.01" />
      </svg>
    ),
    label: "Trusted Quality",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    label: "Wide Interest",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ),
    label: "Promotions",
  },
];

export function DistributorCTA() {
  return (
    <section className="bg-[#0d1f4a] py-16 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Become a Distributor
            </h2>
            <p className="mt-4 text-gray-300 leading-relaxed max-w-md">
              Join hands with Ropox Industries and grow your business with a
              brand that delivers quality, value and trust.
            </p>
            <Link
              href="/distributor"
              className="mt-8 inline-flex items-center rounded-full border-2 border-white px-8 py-3.5 text-sm font-bold text-white hover:bg-white hover:text-[#0d1f4a] transition-colors"
            >
              Join Now
            </Link>
          </motion.div>

          {/* Right — Handshake visual */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Handshake illustration */}
            <div className="relative h-56 w-full max-w-sm rounded-2xl overflow-hidden bg-gradient-to-br from-[#1e3a7a] to-[#0a1628] flex items-center justify-center">
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/5" />
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/5" />
              {/* Icon */}
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 mb-4">
                  <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
                    <path
                      d="M6 28 C6 28 10 32 16 32 C22 32 24 28 30 28 C36 28 38 32 42 32"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6 28 L6 38 C6 38 16 42 24 42 C32 42 42 38 42 38 L42 28"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 20 L15 28 M24 16 L24 28 M33 20 L33 28"
                      stroke="#e91e63"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="15" cy="16" r="4" fill="#e91e63" opacity="0.6" />
                    <circle cx="24" cy="12" r="4" fill="#e91e63" opacity="0.6" />
                    <circle cx="33" cy="16" r="4" fill="#e91e63" opacity="0.6" />
                  </svg>
                </div>
                <p className="text-white font-bold text-lg">Partner With Us</p>
                <p className="text-gray-400 text-sm">Let&apos;s grow together</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Benefits strip */}
        <div className="mt-14 border-t border-white/10 pt-12">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.label}
                className="flex flex-col items-center gap-2 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                  {b.icon}
                </div>
                <p className="text-xs font-semibold text-gray-300">{b.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
