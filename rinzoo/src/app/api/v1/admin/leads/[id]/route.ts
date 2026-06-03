import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const updateSchema = z.object({
  status: z.enum(["PENDING", "REVIEWING", "APPROVED", "REJECTED"]).optional(),
  reviewNote: z.string().optional(),
  assignedToId: z.string().optional().nullable(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const lead = await db.distributorLead.findUnique({
      where: { id },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });

    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: lead });
  } catch (err) {
    console.error("[GET /api/v1/admin/leads/[id]]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const data = updateSchema.parse(body);

    const updateData: Record<string, unknown> = { ...data };
    if (data.status === "APPROVED" || data.status === "REJECTED") {
      updateData.reviewedAt = new Date();
    }

    const lead = await db.distributorLead.update({
      where: { id },
      data: updateData,
      include: { assignedTo: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ data: lead });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    }
    console.error("[PUT /api/v1/admin/leads/[id]]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
