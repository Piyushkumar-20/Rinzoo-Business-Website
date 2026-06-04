import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  badgeText: z.string().optional(),
  type: z.enum(["TRIAL", "SEASONAL", "BULK", "PROMO"]).optional(),
  discountPct: z.number().min(0).max(100).nullable().optional(),
  startsAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  isActive: z.boolean().optional(),
  priority: z.number().int().optional(),
  productIds: z.array(z.string()).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const offer = await db.offer.findUnique({
      where: { id },
      include: {
        products: { include: { product: { select: { id: true, name: true } } } },
        createdBy: { select: { name: true } },
      },
    });

    if (!offer) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: offer });
  } catch (err) {
    console.error("[GET /api/v1/admin/offers/[id]]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { productIds, discountPct, startsAt, expiresAt, ...rest } = updateSchema.parse(body);

    const offer = await db.offer.update({
      where: { id },
      data: {
        ...rest,
        ...(discountPct !== undefined && { discountPct }),
        ...(startsAt && { startsAt: new Date(startsAt) }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
        // Replace product links if provided
        ...(productIds !== undefined && {
          products: {
            deleteMany: {},
            create: productIds.map((productId) => ({ productId })),
          },
        }),
      },
      include: {
        products: { include: { product: { select: { id: true, name: true } } } },
      },
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ data: offer });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    }
    console.error("[PUT /api/v1/admin/offers/[id]]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await db.offer.delete({ where: { id } });
    revalidatePath("/", "layout");
    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    console.error("[DELETE /api/v1/admin/offers/[id]]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
