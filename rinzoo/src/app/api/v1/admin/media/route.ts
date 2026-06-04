import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import type { Prisma } from "@prisma/client";

const CONTENT_ROLES = ["super_admin", "marketing_manager", "content_manager"];

function canManageMedia(role?: string) {
  return !!role && CONTENT_ROLES.includes(role);
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const pageSize = 24;

    const where: Prisma.MediaWhereInput = q
      ? {
          OR: [
            { originalName: { contains: q, mode: "insensitive" } },
            { filename: { contains: q, mode: "insensitive" } },
            { altText: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      db.media.findMany({
        where,
        orderBy: { uploadedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.media.count({ where }),
    ]);

    return NextResponse.json({
      data: items,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (err) {
    console.error("[GET /api/v1/admin/media]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

const uploadSchema = z.object({
  // base64 data URI from the browser
  file: z.string().startsWith("data:", "Expected a base64 data URI"),
  fileName: z.string().min(1).max(200),
  altText: z.string().max(300).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!canManageMedia(session.user.role)) {
      return NextResponse.json({ error: { code: "FORBIDDEN", message: "Not allowed to upload media" } }, { status: 403 });
    }
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: { code: "NOT_CONFIGURED", message: "Cloudinary is not configured. Set CLOUDINARY_URL." } },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { file, fileName, altText } = uploadSchema.parse(body);

    const result = await uploadToCloudinary(file, "rinzoo");

    const mimeType = (file.match(/^data:([^;]+);/)?.[1]) ?? `image/${result.format}`;

    const media = await db.media.create({
      data: {
        filename: result.publicId.split("/").pop() ?? fileName,
        originalName: fileName,
        url: result.url,
        cloudinaryPublicId: result.publicId,
        mimeType,
        sizeBytes: result.bytes,
        width: result.width,
        height: result.height,
        altText: altText ?? null,
        uploadedById: session.user.id,
      },
    });

    return NextResponse.json({ data: media }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    }
    console.error("[POST /api/v1/admin/media]", err);
    return NextResponse.json(
      { error: { code: "UPLOAD_FAILED", message: err instanceof Error ? err.message : "Upload failed" } },
      { status: 500 }
    );
  }
}
