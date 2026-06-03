import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const pageSize = 25;

    const where: Prisma.ContactSubmissionWhereInput = {
      ...(status ? { status: status as Prisma.EnumContactStatusFilter } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { subject: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [contacts, total, unreadCount] = await Promise.all([
      db.contactSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          subject: true,
          message: true,
          status: true,
          createdAt: true,
        },
      }),
      db.contactSubmission.count({ where }),
      db.contactSubmission.count({ where: { status: "UNREAD" } }),
    ]);

    return NextResponse.json({
      data: contacts,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize), unreadCount },
    });
  } catch (err) {
    console.error("[GET /api/v1/admin/contacts]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
