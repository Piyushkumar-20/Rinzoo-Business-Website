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

    const where: Prisma.DistributorLeadWhereInput = {
      ...(status ? { status: status as Prisma.EnumLeadStatusFilter } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { businessName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { city: { contains: q, mode: "insensitive" } },
              { state: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [leads, total] = await Promise.all([
      db.distributorLead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          businessName: true,
          email: true,
          phone: true,
          city: true,
          state: true,
          status: true,
          source: true,
          createdAt: true,
        },
      }),
      db.distributorLead.count({ where }),
    ]);

    return NextResponse.json({ data: leads, meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
  } catch (err) {
    console.error("[GET /api/v1/admin/leads]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
