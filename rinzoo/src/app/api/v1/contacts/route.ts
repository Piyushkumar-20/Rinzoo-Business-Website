import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  // Rate limit: 3 submissions per IP per 10 minutes
  const ip = getClientIp(request);
  const limit = rateLimit(`contact:${ip}`, 3, 10 * 60 * 1000);
  if (!limit.success) {
    return NextResponse.json(
      { error: { code: "RATE_LIMITED", message: `Too many submissions. Please try again in ${limit.retryAfterSeconds}s.` } },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);
    const submission = await db.contactSubmission.create({ data });
    return NextResponse.json({ data: { id: submission.id } }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid input", issues: err.issues } },
        { status: 400 }
      );
    }
    console.error("[POST /api/v1/contacts]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
