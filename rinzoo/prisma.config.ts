import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma CLI doesn't read .env.local; load it explicitly
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"]!,
  },
});
