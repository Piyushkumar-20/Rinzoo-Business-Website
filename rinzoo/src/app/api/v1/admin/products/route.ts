import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const createSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  tagline: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const products = await db.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { variants: { orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json({ data: products });
  } catch (err) {
    console.error("[GET /api/v1/admin/products]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const data = createSchema.parse(body);

    // Check slug uniqueness
    const existing = await db.product.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json(
        { error: { code: "SLUG_TAKEN", message: "A product with this slug already exists" } },
        { status: 409 }
      );
    }

    const product = await db.product.create({
      data: {
        ...data,
        imageUrl: data.imageUrl || null,
      },
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", issues: err.issues } },
        { status: 400 }
      );
    }
    console.error("[POST /api/v1/admin/products]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
