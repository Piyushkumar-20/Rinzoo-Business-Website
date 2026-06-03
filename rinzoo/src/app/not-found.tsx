import Link from "next/link";
import Image from "next/image";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-4 text-center">
      {/* Decorative bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-white/5" />
      </div>

      <div className="relative z-10 max-w-md">
        <Image
          src="/images/logo.png"
          alt="Rinzoo"
          width={140}
          height={56}
          className="h-14 w-auto object-contain mx-auto mb-10"
        />

        <p className="text-8xl font-black bg-gradient-to-r from-[#5ea3ff] to-[oklch(0.78_0.12_240)] bg-clip-text text-transparent leading-none mb-4">404</p>
        <h1 className="text-2xl font-extrabold text-white mb-3">
          This page got lost in the laundry.
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          We couldn&apos;t find the page you were looking for. It may have been moved, renamed, or never existed.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="rounded-full bg-[#2b7fff] px-6 py-3 text-sm font-bold text-white hover:bg-[#2b7fff]/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="rounded-full border-2 border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
          >
            View Products
          </Link>
          <Link
            href="/contact"
            className="rounded-full border-2 border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
