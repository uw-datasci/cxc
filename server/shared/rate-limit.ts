import "server-only";

/** Outcome of a {@link RateLimiter.check} call. */
export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

interface Window {
  count: number;
  resetAt: number;
}

/**
 * Fixed-window, in-memory rate limiter keyed by an arbitrary string (usually a client IP).
 *
 * Counters live in the memory of one server instance. On Vercel each warm function
 * instance keeps its own counters and they reset on cold start, so this blunts casual
 * floods and scripted retries but is not a hard global cap. For a strict limit, put a
 * shared store (e.g. Redis) behind the same `check` interface or add a platform-level
 * rule such as a Vercel WAF rate limit.
 */
export class RateLimiter {
  private readonly windows = new Map<string, Window>();
  private lastSweep = Date.now();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number
  ) {}

  /** Counts one request for `key` and reports whether it is within the limit. */
  check(key: string): RateLimitResult {
    const now = Date.now();
    this.sweep(now);

    const current = this.windows.get(key);

    if (!current || current.resetAt <= now) {
      this.windows.set(key, { count: 1, resetAt: now + this.windowMs });
      return { allowed: true };
    }

    if (current.count >= this.limit) {
      return { allowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
    }

    current.count += 1;
    return { allowed: true };
  }

  /** Drops expired windows at most once per window so the map cannot grow without bound. */
  private sweep(now: number): void {
    if (now - this.lastSweep < this.windowMs) return;

    this.lastSweep = now;
    for (const [key, window] of this.windows) {
      if (window.resetAt <= now) this.windows.delete(key);
    }
  }
}

/**
 * Best-effort client identifier from proxy headers.
 *
 * Vercel sets `x-forwarded-for` (client address first) and `x-real-ip`. Falls back to a
 * shared bucket when neither is present, which fails safe: unidentifiable clients are
 * limited together rather than not at all.
 */
export function getClientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}
