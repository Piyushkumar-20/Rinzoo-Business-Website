"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919911982666";

const inputClass =
  "w-full rounded-xl bg-neutral-900 border border-white/10 text-neutral-50 placeholder:text-neutral-500 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b7fff] focus:border-transparent";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/v1/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSubmitted(true);
      reset();
    }
  };

  const CONTACTS = [
    { icon: Phone, label: "Phone", value: "+91 99119 82666", href: `tel:+${WHATSAPP_NUMBER}` },
    { icon: Mail, label: "Email", value: "ropoxindustry11@gmail.com", href: "mailto:ropoxindustry11@gmail.com" },
    { icon: MapPin, label: "Address", value: "KH NO 3/18, PL NO 79, Nangloi, Kotla Vihar Phase 1, New Delhi", href: "https://maps.google.com/?q=Nangloi+Kotla+Vihar+Phase+1+New+Delhi" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative px-5 sm:px-8 pt-16 pb-14 sm:pt-20 sm:pb-16 overflow-hidden">
        <div className="pointer-events-none size-96 blur-3xl rounded-full bg-[#2b7fff]/15 absolute -right-24 -top-10" />
        <div className="pointer-events-none size-72 bg-[oklch(0.62_0.19_47)]/15 blur-3xl rounded-full absolute -left-20 -bottom-10" />
        <div className="relative text-center flex flex-col items-center gap-4">
          <Badge className="font-semibold rounded-full bg-neutral-800 text-[#5ea3ff] text-xs px-3 py-1">Get In Touch</Badge>
          <h1 className="font-extrabold text-neutral-50 text-4xl sm:text-5xl leading-[1.05] tracking-tight">
            Contact <span className="bg-gradient-to-r from-[#5ea3ff] to-[oklch(0.78_0.12_240)] bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="max-w-xl text-[#a1a1a1] text-base leading-7">
            Have a question? We&apos;re here to help. Reach out and we&apos;ll respond within 24 hours.
          </p>
        </div>
      </section>

      <div className="max-w-[1140px] mx-auto">
        <section className="px-5 sm:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Info */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-extrabold text-neutral-50 mb-2">Get in Touch</h2>
              {CONTACTS.map((c) => {
                const Icon = c.icon;
                return (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.label === "Address" ? "_blank" : undefined}
                    rel={c.label === "Address" ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900 border border-white/10 hover:border-[#2b7fff]/40 transition-colors"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2b7fff]/15">
                      <Icon className="h-5 w-5 text-[#5ea3ff]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#a1a1a1] uppercase tracking-wider">{c.label}</p>
                      <p className="text-sm font-medium text-neutral-100 mt-0.5">{c.value}</p>
                    </div>
                  </a>
                );
              })}

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-[#25d366] px-6 py-4 text-white hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="h-6 w-6 shrink-0" />
                <div>
                  <p className="font-bold">Chat on WhatsApp</p>
                  <p className="text-sm text-green-100">Fastest response</p>
                </div>
              </a>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center rounded-3xl bg-neutral-900 border border-white/10 p-12 h-full">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2b7fff]/15 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-[#5ea3ff]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-neutral-50">Message Sent!</h3>
                  <p className="mt-2 text-[#a1a1a1]">Thank you! We&apos;ll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-[#5ea3ff] font-medium hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="rounded-3xl bg-neutral-900 border border-white/10 p-6 sm:p-8">
                  <h3 className="text-lg font-extrabold text-neutral-50 mb-6">Send us a Message</h3>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Name *</label>
                        <input {...register("name")} placeholder="Your name" className={inputClass} />
                        {errors.name && <p className="text-xs text-[#ff6467] mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Email *</label>
                        <input {...register("email")} type="email" placeholder="you@example.com" className={inputClass} />
                        {errors.email && <p className="text-xs text-[#ff6467] mt-1">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Phone</label>
                        <input {...register("phone")} placeholder="+91 98765 43210" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Subject</label>
                        <input {...register("subject")} placeholder="How can we help?" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-1">Message *</label>
                      <textarea {...register("message")} rows={5} placeholder="Write your message here..." className={`${inputClass} resize-none`} />
                      {errors.message && <p className="text-xs text-[#ff6467] mt-1">{errors.message.message}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-full bg-[#2b7fff] py-3.5 text-sm font-bold text-white hover:bg-[#2b7fff]/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {isSubmitting ? "Sending…" : "Send Message"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
