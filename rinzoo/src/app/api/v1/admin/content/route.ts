import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { CONTENT_SECTIONS, mergeSectionDefaults } from "@/lib/content-schema";

const CONTENT_ROLES = ["super_admin", "marketing_manager", "content_manager"];
function canEditContent(role?: string) {
  return !!role && CONTENT_ROLES.includes(role);
}

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await db.pageSection.findMany({ where: { page: "home" } });
    const byKey = new Map(rows.map((r) => [r.sectionKey, r]));

    const sections = CONTENT_SECTIONS.map((s) => ({
      key: s.key,
      label: s.label,
      description: s.description,
      fields: s.fields,
      values: mergeSectionDefaults(s.key, (byKey.get(s.key)?.content as Record<string, unknown>) ?? null),
    }));

    return NextResponse.json({ data: sections });
  } catch (err) {
    console.error("[GET /api/v1/admin/content]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Body: { sectionKey: string, values: Record<string, string|boolean> }
const putSchema = z.object({
  sectionKey: z.string().min(1),
  values: z.record(z.string(), z.union([z.string(), z.boolean()])),
});

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!canEditContent(session.user.role)) {
      return NextResponse.json({ error: { code: "FORBIDDEN", message: "Not allowed to edit content" } }, { status: 403 });
    }

    const { sectionKey, values } = putSchema.parse(await request.json());

    const section = CONTENT_SECTIONS.find((s) => s.key === sectionKey);
    if (!section) {
      return NextResponse.json({ error: { code: "UNKNOWN_SECTION", message: "Unknown section" } }, { status: 400 });
    }

    // Whitelist: only persist fields declared in the schema
    const allowed: Record<string, string | boolean> = {};
    for (const f of section.fields) {
      if (f.key in values) allowed[f.key] = values[f.key];
    }

    const isPublished = allowed.visible !== false; // honor visibility toggle

    const saved = await db.pageSection.upsert({
      where: { page_sectionKey: { page: "home", sectionKey } },
      update: { content: allowed, isPublished, updatedById: session.user.id },
      create: { page: "home", sectionKey, content: allowed, isPublished, updatedById: session.user.id },
    });

    // Bust the ISR full-route cache so the change appears immediately on the
    // public site (homepage + all pages sharing the marketing layout/logo).
    revalidatePath("/", "layout");

    return NextResponse.json({ data: { sectionKey: saved.sectionKey, values: allowed } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    }
    console.error("[PUT /api/v1/admin/content]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
