import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  // Rate limit: 5 signups per IP per hour
  const ip = getClientIp(request);
  const limit = rateLimit(`signup:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.success) {
    return NextResponse.json(
      { error: { code: "RATE_LIMITED", message: `Too many attempts. Try again in ${limit.retryAfterSeconds}s.` } },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const body = await request.json();
    const { name, email, password } = schema.parse(body);

    // Check for existing account
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: { code: "EMAIL_TAKEN", message: "An account with this email already exists" } },
        { status: 409 }
      );
    }

    // Ensure the "user" role exists
    const userRole = await db.role.upsert({
      where: { name: "user" },
      update: {},
      create: { name: "user", label: "User", description: "Standard website user account" },
    });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        roleId: userRole.id,
      },
    });

    return NextResponse.json({ data: { id: user.id } }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", issues: err.issues } },
        { status: 400 }
      );
    }
    console.error("[POST /api/v1/auth/signup]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
