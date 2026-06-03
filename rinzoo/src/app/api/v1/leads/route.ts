import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(2),
  businessName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
  annualTurnoverRange: z.string().optional(),
  currentBrands: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  // Rate limit: 2 submissions per IP per 30 minutes (distributor leads)
  const ip = getClientIp(request);
  const limit = rateLimit(`lead:${ip}`, 2, 30 * 60 * 1000);
  if (!limit.success) {
    return NextResponse.json(
      { error: { code: "RATE_LIMITED", message: `Too many submissions. Please try again in ${limit.retryAfterSeconds}s.` } },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);
    const lead = await db.distributorLead.create({ data: { ...data, source: "WEB" } });
    return NextResponse.json({ data: { id: lead.id, status: lead.status } }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid input", issues: err.issues } },
        { status: 400 }
      );
    }
    console.error("[POST /api/v1/leads]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
