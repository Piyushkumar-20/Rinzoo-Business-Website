import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Called by the sign-in page when login fails, to determine if the reason
 * is an unverified email rather than wrong credentials.
 * Returns minimal info to prevent email enumeration.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.toLowerCase().trim();

  if (!email) {
    return NextResponse.json({ status: "UNKNOWN" });
  }

  const user = await db.user.findUnique({
    where: { email },
    select: {
      isActive: true,
      emailVerifiedAt: true,
      role: { select: { name: true } },
    },
  });

  // Don't reveal whether an admin/staff account exists
  if (!user || user.role.name !== "user") {
    return NextResponse.json({ status: "UNKNOWN" });
  }

  if (!user.isActive) {
    return NextResponse.json({ status: "UNKNOWN" });
  }

  if (!user.emailVerifiedAt) {
    return NextResponse.json({ status: "UNVERIFIED" });
  }

  return NextResponse.json({ status: "VERIFIED" });
}
