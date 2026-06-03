import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const createSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  badgeText: z.string().optional(),
  type: z.enum(["TRIAL", "SEASONAL", "BULK", "PROMO"]),
  discountPct: z.number().min(0).max(100).optional(),
  startsAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
  priority: z.number().int().default(0),
  productIds: z.array(z.string()).default([]),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const offers = await db.offer.findMany({
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      include: {
        createdBy: { select: { name: true } },
        products: { include: { product: { select: { name: true } } } },
      },
    });

    return NextResponse.json({ data: offers });
  } catch (err) {
    console.error("[GET /api/v1/admin/offers]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { productIds, discountPct, expiresAt, ...rest } = createSchema.parse(body);

    const offer = await db.offer.create({
      data: {
        ...rest,
        discountPct: discountPct ?? null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        startsAt: new Date(rest.startsAt),
        createdById: session.user.id,
        products: {
          create: productIds.map((productId) => ({ productId })),
        },
      },
      include: {
        products: { include: { product: { select: { name: true } } } },
      },
    });

    return NextResponse.json({ data: offer }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    }
    console.error("[POST /api/v1/admin/offers]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
