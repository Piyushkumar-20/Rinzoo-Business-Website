import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env.local only if not in CI/production (Vercel provides env vars directly)
if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"]!,
  },
});
