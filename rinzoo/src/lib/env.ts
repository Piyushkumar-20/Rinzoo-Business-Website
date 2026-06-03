/**
 * Validate required environment variables at startup.
 * Import this file early in the app (e.g. in db.ts or auth.ts).
 * Throws a clear, actionable error instead of a cryptic runtime failure.
 */

const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
] as const;

const OPTIONAL_ENV_VARS = [
  "DIRECT_URL",
  "NEXT_PUBLIC_WHATSAPP_NUMBER",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
] as const;

function validateEnv() {
  const missing: string[] = [];

  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `\n\n❌  Missing required environment variables:\n` +
        missing.map((k) => `   • ${k}`).join("\n") +
        `\n\nCreate a .env.local file with these values.\n` +
        `See .env.example for reference.\n`
    );
  }

  // Warn about missing optional vars (no throw)
  if (process.env.NODE_ENV !== "production") {
    for (const key of OPTIONAL_ENV_VARS) {
      if (!process.env[key]) {
        console.warn(`⚠️  Optional env var not set: ${key}`);
      }
    }
  }
}

// Run once at module load time (server-side only)
if (typeof window === "undefined") {
  validateEnv();
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  DIRECT_URL: process.env.DIRECT_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
  WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919911982666",
  NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;
