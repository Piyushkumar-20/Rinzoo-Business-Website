import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  roleName: z.string().optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { roleName, password, ...rest } = updateSchema.parse(body);

    // Prevent self-deactivation
    if (id === session.user.id && rest.isActive === false) {
      return NextResponse.json(
        { error: { code: "SELF_DEACTIVATION", message: "You cannot deactivate your own account" } },
        { status: 400 }
      );
    }

    let roleId: string | undefined;
    if (roleName) {
      const role = await db.role.findUnique({ where: { name: roleName } });
      if (!role) {
        return NextResponse.json({ error: { code: "INVALID_ROLE", message: "Role not found" } }, { status: 400 });
      }
      roleId = role.id;
    }

    const passwordHash = password ? await bcrypt.hash(password, 12) : undefined;

    const user = await db.user.update({
      where: { id },
      data: {
        ...rest,
        ...(roleId ? { roleId } : {}),
        ...(passwordHash ? { passwordHash } : {}),
      },
      include: { role: { select: { name: true, label: true } } },
    });

    return NextResponse.json({ data: { id: user.id, name: user.name, email: user.email, isActive: user.isActive, role: user.role } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    }
    console.error("[PUT /api/v1/admin/users/[id]]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
