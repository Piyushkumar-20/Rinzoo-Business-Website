import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const variantSchema = z.object({
  size: z.string().min(1),
  price: z.number().positive(),
  mrp: z.number().positive(),
  sku: z.string().optional(),
  isTrial: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: productId } = await params;
    const body = await request.json();
    const data = variantSchema.parse(body);

    const variant = await db.productVariant.create({
      data: { ...data, productId },
    });

    return NextResponse.json({ data: variant }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    }
    console.error("[POST /api/v1/admin/products/[id]/variants]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
