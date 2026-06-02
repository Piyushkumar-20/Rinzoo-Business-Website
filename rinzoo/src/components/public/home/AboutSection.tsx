"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const CHECKPOINTS = [
  "Premium Cleaning Performance",
  "Budget-Friendly Pricing",
  "Reliable Quality",
  "Customer Satisfaction",
  "Continuous Improvement & Innovation",
];

export function AboutSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              About Ropox Industries
            </h2>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Ropox Industries is a dedicated manufacturing company focused on
              delivering high-quality and affordable cleaning solutions through
              its flagship brand, Rinzoo Detergent Powder.
            </p>
            <ul className="mt-6 space-y-3">
              {CHECKPOINTS.map((point, i) => (
                <motion.li
                  key={point}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-[#e91e63] shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right — Factory image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Image placeholder styled like the design */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gray-100 aspect-[4/3]">
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                {/* Factory illustration placeholder */}
                <div className="w-4/5 space-y-3">
                  {/* Sky */}
                  <div className="h-16 rounded-t-xl bg-gradient-to-b from-blue-200 to-blue-100" />
                  {/* Building */}
                  <div className="relative h-28 bg-gray-400 rounded-sm flex items-end">
                    {/* Windows */}
                    {[0, 1, 2, 3].map((w) => (
                      <div
                        key={w}
                        className="absolute top-4 bg-blue-200 rounded-sm"
                        style={{
                          left: `${8 + w * 22}%`,
                          width: "14%",
                          height: "40%",
                        }}
                      />
                    ))}
                    {/* Door */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-12 w-10 bg-gray-600 rounded-t-sm" />
                    {/* Signboard */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#e91e63] text-white text-xs font-bold px-3 py-1 rounded">
                      ROPOX INDUSTRIES
                    </div>
                  </div>
                  {/* Ground */}
                  <div className="h-6 bg-green-200 rounded-b-xl" />
                </div>
              </div>
              {/* Overlay brand label */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <p className="text-xs font-bold text-gray-900">ROPOX INDUSTRIES</p>
                <p className="text-[10px] text-gray-500">Manufacturing Excellence</p>
              </div>
            </div>

            {/* Floating stat card */}
            <motion.div
              className="absolute -bottom-6 -left-6 bg-[#0d1f4a] text-white rounded-2xl px-5 py-4 shadow-xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-2xl font-extrabold text-[#e91e63]">100%</p>
              <p className="text-xs text-gray-300">Quality Assured</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
