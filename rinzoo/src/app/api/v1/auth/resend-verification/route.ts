import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, buildVerificationEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  // Rate limit: 3 resend attempts per IP per 15 minutes
  const ip = getClientIp(request);
  const limit = rateLimit(`resend-verify:${ip}`, 3, 15 * 60 * 1000);
  if (!limit.success) {
    return NextResponse.json(
      { error: { code: "RATE_LIMITED", message: `Too many attempts. Try again in ${limit.retryAfterSeconds}s.` } },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email } = schema.parse(body);

    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, name: true, emailVerifiedAt: true, role: { select: { name: true } } },
    });

    // Always return 200 to prevent email enumeration attacks
    if (!user || user.emailVerifiedAt || user.role.name !== "user") {
      return NextResponse.json({ data: { message: "If that email exists and is unverified, a new link has been sent." } });
    }

    // Generate a fresh token
    const verificationToken = randomUUID();
    await db.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    await sendEmail({
      to: email,
      subject: "Your new Rinzoo verification link",
      html: buildVerificationEmail(user.name, verificationToken),
    });

    return NextResponse.json({ data: { message: "If that email exists and is unverified, a new link has been sent." } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR" } }, { status: 400 });
    }
    console.error("[POST /api/v1/auth/resend-verification]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
