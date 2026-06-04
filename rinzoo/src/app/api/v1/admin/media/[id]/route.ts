import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

const CONTENT_ROLES = ["super_admin", "marketing_manager", "content_manager"];
function canManageMedia(role?: string) {
  return !!role && CONTENT_ROLES.includes(role);
}

type Params = { params: Promise<{ id: string }> };

const updateSchema = z.object({ altText: z.string().max(300).optional() });

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!canManageMedia(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id } = await params;
    const data = updateSchema.parse(await request.json());
    const media = await db.media.update({ where: { id }, data: { altText: data.altText ?? null } });
    return NextResponse.json({ data: media });
  } catch (err) {
    console.error("[PATCH /api/v1/admin/media/[id]]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!canManageMedia(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const media = await db.media.findUnique({ where: { id } });
    if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Remove from Cloudinary first (best-effort), then the DB record
    if (media.cloudinaryPublicId) {
      await deleteFromCloudinary(media.cloudinaryPublicId);
    }
    await db.media.delete({ where: { id } });

    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    console.error("[DELETE /api/v1/admin/media/[id]]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
