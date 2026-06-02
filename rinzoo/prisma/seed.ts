import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { ROLE_PERMISSIONS } from "../src/lib/rbac-constants";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Roles ──────────────────────────────────────────────────────────────────
  const roleData = [
    { name: "super_admin", label: "Super Admin", description: "Full access to all features" },
    { name: "marketing_manager", label: "Marketing Manager", description: "Manage products, offers, and media" },
    { name: "sales_manager", label: "Sales Manager", description: "Manage distributor leads and contacts" },
    { name: "content_manager", label: "Content Manager", description: "Manage products and media content" },
  ];

  const roles: Record<string, { id: string }> = {};
  for (const r of roleData) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { label: r.label, description: r.description },
      create: r,
    });
    roles[r.name] = role;
    console.log(`  ✓ Role: ${r.label}`);
  }

  // ── Permissions ────────────────────────────────────────────────────────────
  const allPermissions = new Set<string>();
  for (const perms of Object.values(ROLE_PERMISSIONS)) {
    for (const p of perms) allPermissions.add(`${p.action}:${p.subject}`);
  }

  const permMap: Record<string, { id: string }> = {};
  for (const key of allPermissions) {
    const [action, subject] = key.split(":");
    const perm = await prisma.permission.upsert({
      where: { action_subject: { action, subject } },
      update: {},
      create: {
        action,
        subject,
        label: `${action.charAt(0).toUpperCase() + action.slice(1)} ${subject}`,
      },
    });
    permMap[key] = perm;
  }
  console.log(`  ✓ Permissions: ${allPermissions.size} created`);

  // ── Role–Permission assignments ────────────────────────────────────────────
  for (const [roleName, perms] of Object.entries(ROLE_PERMISSIONS)) {
    const role = roles[roleName];
    if (!role) continue;
    for (const p of perms) {
      const key = `${p.action}:${p.subject}`;
      const perm = permMap[key];
      if (!perm) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
    }
  }
  console.log("  ✓ Role permissions assigned");

  // ── Super Admin user ───────────────────────────────────────────────────────
  const superAdminRole = roles["super_admin"];
  const passwordHash = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@rinzoo.in" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@rinzoo.in",
      passwordHash,
      roleId: superAdminRole.id,
      isActive: true,
    },
  });
  console.log(`  ✓ Super Admin: ${admin.email} / Admin@123`);

  // ── Default Settings ───────────────────────────────────────────────────────
  const settings = [
    { key: "company_name", value: "Ropox Industries", type: "STRING" as const, label: "Company Name", group: "general" },
    { key: "brand_name", value: "Rinzoo", type: "STRING" as const, label: "Brand Name", group: "general" },
    { key: "contact_email", value: "info@rinzoo.in", type: "STRING" as const, label: "Contact Email", group: "general" },
    { key: "whatsapp_number", value: "919999999999", type: "STRING" as const, label: "WhatsApp Number", group: "general" },
    { key: "seo_title", value: "Rinzoo Detergent Powder — Premium Results, Smart Pricing", type: "STRING" as const, label: "Default SEO Title", group: "seo" },
    { key: "seo_description", value: "Rinzoo Detergent Powder by Ropox Industries. Powerful cleaning, fabric-friendly, long-lasting freshness at every household price.", type: "STRING" as const, label: "Default SEO Description", group: "seo" },
    { key: "notification_email", value: "alerts@rinzoo.in", type: "STRING" as const, label: "Notification Email (receives lead alerts)", group: "notifications" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, label: s.label },
      create: s,
    });
  }
  console.log("  ✓ Default settings seeded");

  console.log("\n✅ Database seeded successfully!");
  console.log("   Login: admin@rinzoo.in / Admin@123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
