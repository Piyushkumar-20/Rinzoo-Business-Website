import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only allow framing from same origin (admin iframes etc.)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Control referrer info
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features we don't need
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Speed up DNS lookups for third-party assets
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Enforce HTTPS for 2 years (enable only after deploying to HTTPS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Content Security Policy
  // 'unsafe-inline' required for Framer Motion (inline styles) + Next.js hydration
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' *.neon.tech wss://*.neon.tech https://wa.me",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Remove X-Powered-By: Next.js header (no need to advertise)
  poweredByHeader: false,

  // Enable React strict mode for catching subtle bugs
  reactStrictMode: true,

  // Compress responses
  compress: true,

  // Image optimisation
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 h
    // Approved landing-page lifestyle photos (Unsplash) + admin-uploaded media (Cloudinary)
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  // Security headers applied to every response
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Build-time flag for --webpack (Windows Turbopack workaround)
  // Already handled via CLI flag in package.json scripts
};

export default nextConfig;
