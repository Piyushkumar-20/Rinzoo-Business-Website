"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Full name is required"),
  businessName: z.string().min(2, "Business name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  annualTurnoverRange: z.string().optional(),
  currentBrands: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const BENEFITS = [
  "Attractive profit margins",
  "Timely stock delivery",
  "Marketing support & promotions",
  "Wide market potential",
  "Dedicated sales support",
  "Trusted quality product",
];

const TURNOVER_OPTIONS = [
  "Less than ₹10 Lakh",
  "₹10 – ₹50 Lakh",
  "₹50 Lakh – ₹1 Crore",
  "More than ₹1 Crore",
];

export default function DistributorPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/v1/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSubmitted(true);
      reset();
    }
  };

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
            Become a <span className="text-[#e91e63]">Distributor</span>
          </motion.h1>
          <motion.p
            className="mt-4 text-gray-300 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Partner with Ropox Industries and grow your business with a trusted
            brand that delivers quality, value and support.
          </motion.p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Benefits */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
                Why Partner With Us?
              </h2>
              <ul className="space-y-4">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#e91e63] shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-2xl bg-[#0d1f4a] p-6 text-white">
                <p className="text-sm font-semibold text-[#e91e63] uppercase tracking-widest mb-2">
                  Direct WhatsApp
                </p>
                <p className="text-gray-300 text-sm">
                  Prefer to talk first? Chat with our sales team directly on WhatsApp.
                </p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999"}?text=Hi! I'm interested in becoming a Rinzoo distributor.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <motion.div
                  className="flex flex-col items-center justify-center text-center rounded-2xl bg-white p-12 shadow-lg h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900">Application Received!</h3>
                  <p className="mt-2 text-gray-500">
                    Thank you for your interest. Our team will reach out to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm text-[#e91e63] font-medium hover:underline"
                  >
                    Submit another application
                  </button>
                </motion.div>
              ) : (
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h3 className="text-lg font-extrabold text-gray-900 mb-6">
                    Distributor Application Form
                  </h3>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          {...register("name")}
                          placeholder="Your full name"
                          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e91e63] focus:border-transparent"
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                      </div>

                      {/* Business Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                        <input
                          {...register("businessName")}
                          placeholder="Your business name"
                          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e91e63] focus:border-transparent"
                        />
                        {errors.businessName && <p className="text-xs text-red-500 mt-1">{errors.businessName.message}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="you@example.com"
                          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e91e63] focus:border-transparent"
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <input
                          {...register("phone")}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e91e63] focus:border-transparent"
                        />
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <input
                          {...register("city")}
                          placeholder="City"
                          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e91e63] focus:border-transparent"
                        />
                        {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                        <input
                          {...register("state")}
                          placeholder="State"
                          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e91e63] focus:border-transparent"
                        />
                        {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                        <input
                          {...register("pincode")}
                          placeholder="400001"
                          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e91e63] focus:border-transparent"
                        />
                        {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
                      </div>

                      {/* Turnover */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Annual Turnover</label>
                        <select
                          {...register("annualTurnoverRange")}
                          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e91e63] focus:border-transparent bg-white"
                        >
                          <option value="">Select range</option>
                          {TURNOVER_OPTIONS.map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Current brands */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Brands Handled</label>
                      <input
                        {...register("currentBrands")}
                        placeholder="e.g. Surf Excel, Ariel, etc."
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e91e63] focus:border-transparent"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
                      <textarea
                        {...register("message")}
                        rows={3}
                        placeholder="Tell us more about your distribution network..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e91e63] focus:border-transparent resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-full bg-[#e91e63] py-3.5 text-sm font-bold text-white hover:bg-[#c2185b] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isSubmitting ? "Submitting…" : "Submit Application"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
