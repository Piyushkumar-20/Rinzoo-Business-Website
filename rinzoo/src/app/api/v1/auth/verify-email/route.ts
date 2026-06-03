import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { verificationToken: token },
    select: { id: true, emailVerifiedAt: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: { code: "INVALID_TOKEN", message: "This verification link is invalid or has already been used." } },
      { status: 400 }
    );
  }

  if (user.emailVerifiedAt) {
    // Already verified — still counts as success
    return NextResponse.json({ data: { message: "Email already verified." } });
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerifiedAt: new Date(),
      verificationToken: null, // consume the token so it can't be reused
    },
  });

  return NextResponse.json({ data: { message: "Email verified successfully." } });
}
