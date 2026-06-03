import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// All editable settings with defaults
export const SETTINGS_SCHEMA = [
  { key: "site.phone",         label: "Phone Number",          group: "Contact",  type: "STRING", default: "+91 99999 99999" },
  { key: "site.email",         label: "Email Address",         group: "Contact",  type: "STRING", default: "info@rinzoo.in" },
  { key: "site.address",       label: "Address",               group: "Contact",  type: "STRING", default: "Ropox Industries, India" },
  { key: "site.whatsapp",      label: "WhatsApp Number",       group: "Contact",  type: "STRING", default: "919999999999" },
  { key: "site.tagline",       label: "Site Tagline",          group: "Branding", type: "STRING", default: "Premium Results, Smart Pricing" },
  { key: "site.company",       label: "Company Name",          group: "Branding", type: "STRING", default: "Ropox Industries" },
  { key: "home.offers_count",  label: "Max Offers on Home",    group: "Display",  type: "NUMBER", default: "4" },
  { key: "home.show_offers",   label: "Show Offers on Home",   group: "Display",  type: "BOOLEAN", default: "true" },
] as const;

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbSettings = await db.setting.findMany();
    const settingsMap = Object.fromEntries(dbSettings.map((s) => [s.key, s.value]));

    // Merge DB values with schema defaults
    const settings = SETTINGS_SCHEMA.map((s) => ({
      ...s,
      value: settingsMap[s.key] ?? s.default,
    }));

    return NextResponse.json({ data: settings });
  } catch (err) {
    console.error("[GET /api/v1/admin/settings]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

const updateSchema = z.record(z.string(), z.string());

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const updates = updateSchema.parse(body);

    const validKeys = new Set(SETTINGS_SCHEMA.map((s) => s.key));

    await Promise.all(
      Object.entries(updates)
        .filter(([key]) => validKeys.has(key as typeof SETTINGS_SCHEMA[number]["key"]))
        .map(([key, value]) => {
          const schema = SETTINGS_SCHEMA.find((s) => s.key === key)!;
          return db.setting.upsert({
            where: { key },
            update: { value, updatedById: session.user.id },
            create: {
              key,
              value,
              type: schema.type as "STRING" | "NUMBER" | "BOOLEAN" | "JSON",
              label: schema.label,
              group: schema.group,
              updatedById: session.user.id,
            },
          });
        })
    );

    return NextResponse.json({ data: { updated: Object.keys(updates).length } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    }
    console.error("[PUT /api/v1/admin/settings]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
