import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  roleName: z.string().min(1),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { role: true },
    });

    return NextResponse.json({ data: users });
  } catch (err) {
    console.error("[GET /api/v1/admin/users]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, email, password, roleName } = createSchema.parse(body);

    // Check email uniqueness
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: { code: "EMAIL_TAKEN", message: "A user with this email already exists" } },
        { status: 409 }
      );
    }

    const role = await db.role.findUnique({ where: { name: roleName } });
    if (!role) {
      return NextResponse.json({ error: { code: "INVALID_ROLE", message: "Role not found" } }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: { name, email, passwordHash, roleId: role.id },
      include: { role: { select: { name: true, label: true } } },
    });

    return NextResponse.json({ data: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    }
    console.error("[POST /api/v1/admin/users]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
