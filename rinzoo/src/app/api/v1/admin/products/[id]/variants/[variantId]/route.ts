import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const updateSchema = z.object({
  size: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  mrp: z.number().positive().optional(),
  sku: z.string().optional(),
  isTrial: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

type Params = { params: Promise<{ id: string; variantId: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { variantId } = await params;
    const body = await request.json();
    const data = updateSchema.parse(body);

    const variant = await db.productVariant.update({ where: { id: variantId }, data });
    return NextResponse.json({ data: variant });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    }
    console.error("[PUT /api/v1/admin/products/[id]/variants/[variantId]]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { variantId } = await params;
    await db.productVariant.delete({ where: { id: variantId } });
    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    console.error("[DELETE /api/v1/admin/products/[id]/variants/[variantId]]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
