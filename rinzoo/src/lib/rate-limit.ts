/**
 * Simple in-memory IP-based rate limiter.
 * Works for single-instance deployments (Vercel serverless, single VPS).
 * For multi-instance, swap the Map for a Redis/Upstash store.
 */

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

// Prune expired entries periodically to prevent memory leak
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  },
  10 * 60 * 1000 // every 10 minutes
);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

/**
 * Check whether an identifier (IP address) is within the rate limit.
 *
 * @param identifier  - Usually the client IP address
 * @param limit       - Max requests per window (default 5)
 * @param windowMs    - Window size in ms (default 60 s)
 */
export function rateLimit(
  identifier: string,
  limit = 5,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const existing = store.get(identifier);

  if (!existing || now > existing.resetAt) {
    const entry: Entry = { count: 1, resetAt: now + windowMs };
    store.set(identifier, entry);
    return { success: true, remaining: limit - 1, resetAt: entry.resetAt, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count++;
  return {
    success: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
    retryAfterSeconds: 0,
  };
}

/**
 * Extract the real client IP from a Next.js Request.
 * Handles proxies (Vercel, Cloudflare, nginx).
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ?? // Cloudflare
    "unknown"
  );
}
