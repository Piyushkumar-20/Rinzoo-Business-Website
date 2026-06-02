"use client";

import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
        <rect x="8" y="6" width="24" height="28" rx="4" stroke="#e91e63" strokeWidth="2.5" />
        <path d="M14 15 Q20 22 26 15" stroke="#e91e63" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 22 Q20 29 26 22" stroke="#e91e63" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="10" r="3" fill="#e91e63" opacity="0.3" />
      </svg>
    ),
    title: "Powerful Cleaning",
    desc: "Removes tough stains effortlessly",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
        <path d="M20 6 C12 10 8 18 12 26 C16 34 24 34 28 26 C32 18 28 10 20 6Z" stroke="#e91e63" strokeWidth="2.5" />
        <path d="M16 20 C18 24 22 24 24 20" stroke="#e91e63" strokeWidth="2" strokeLinecap="round" />
        <circle cx="17" cy="17" r="2" fill="#e91e63" opacity="0.5" />
        <circle cx="23" cy="17" r="2" fill="#e91e63" opacity="0.5" />
      </svg>
    ),
    title: "Fabric Friendly",
    desc: "Gentle on clothes, hard on dirt",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
        <circle cx="20" cy="20" r="7" stroke="#e91e63" strokeWidth="2.5" />
        <path d="M20 6 L20 10M20 30 L20 34M6 20 L10 20M30 20 L34 20" stroke="#e91e63" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10.5 10.5 L13.3 13.3M26.7 26.7 L29.5 29.5M10.5 29.5 L13.3 26.7M26.7 13.3 L29.5 10.5" stroke="#e91e63" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="3" fill="#e91e63" opacity="0.4" />
      </svg>
    ),
    title: "Fresh & Long Lasting Fragrance",
    desc: "For a refreshing wash every time",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
        <path d="M12 28 L10 34 L20 31 L30 34 L28 28" stroke="#e91e63" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 20 C10 14 14 8 20 8 C26 8 30 14 30 20" stroke="#e91e63" strokeWidth="2.5" />
        <path d="M16 20 L18 22 L24 16" stroke="#e91e63" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Affordable",
    desc: "Smart pricing that saves more",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
        <path d="M20 6 L23 14 L32 14 L25 19 L28 28 L20 23 L12 28 L15 19 L8 14 L17 14 Z" stroke="#e91e63" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="4" fill="#e91e63" opacity="0.25" />
      </svg>
    ),
    title: "Consistent Quality",
    desc: "Manufactured with high quality standards",
  },
];

export function FeaturesBar() {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl hover:bg-pink-50 transition-colors group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 group-hover:bg-white transition-colors shadow-sm">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">{f.title}</p>
                <p className="mt-1 text-xs text-gray-500 leading-snug">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
