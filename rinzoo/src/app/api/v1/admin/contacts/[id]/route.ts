import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const updateSchema = z.object({
  status: z.enum(["UNREAD", "READ", "REPLIED", "ARCHIVED"]).optional(),
  assignedToId: z.string().optional().nullable(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const contact = await db.contactSubmission.findUnique({
      where: { id },
      include: { assignedTo: { select: { id: true, name: true } } },
    });

    if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: contact });
  } catch (err) {
    console.error("[GET /api/v1/admin/contacts/[id]]", err);
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
    if (data.status === "REPLIED") {
      updateData.repliedAt = new Date();
    }

    const contact = await db.contactSubmission.update({ where: { id }, data: updateData });
    return NextResponse.json({ data: contact });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    }
    console.error("[PUT /api/v1/admin/contacts/[id]]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
