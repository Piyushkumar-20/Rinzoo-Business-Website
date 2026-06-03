import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public POST endpoints that don't require authentication
const PUBLIC_API_POSTS = ["/api/v1/leads", "/api/v1/contacts", "/api/v1/auth/signup"];

// Roles that have admin access (everything except regular "user" accounts)
const ADMIN_ROLES = ["super_admin", "marketing_manager", "sales_manager", "content_manager"];

function isAdminRole(role: unknown): boolean {
  return typeof role === "string" && ADMIN_ROLES.includes(role);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Public form/auth API endpoints — no auth required ────────────────────
  const isPublicPost =
    PUBLIC_API_POSTS.some((p) => pathname === p) && request.method === "POST";
  if (isPublicPost) return NextResponse.next();

  // ── Get JWT token (edge-safe, no DB call) ────────────────────────────────
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET! });

  // ── Admin UI routes (/admin/*) ────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/signin";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    // Regular user accounts cannot access admin UI
    if (!isAdminRole(token.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // ── Admin API routes (/api/v1/admin/*) ───────────────────────────────────
  if (pathname.startsWith("/api/v1/admin")) {
    if (!token) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }
    if (!isAdminRole(token.role)) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Admin access required" } },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  // ── Other /api/v1/* routes — require any valid session ───────────────────
  if (pathname.startsWith("/api/v1")) {
    if (!token) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/v1/:path*"],
};
