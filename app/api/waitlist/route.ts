import { RaftResponse, withRaft } from "@uw-datasci/raft";

import { getClientKey, RateLimiter } from "@/server/shared/rate-limit";
import { waitlistService } from "@/server/waitlist/waitlist.service";

/** Each client may submit at most this many waitlist requests per window. */
const WAITLIST_RATE_LIMIT = 5;
const WAITLIST_RATE_WINDOW_MS = 10 * 60 * 1000;

const rateLimiter = new RateLimiter(WAITLIST_RATE_LIMIT, WAITLIST_RATE_WINDOW_MS);

/**
 * Public waitlist submission endpoint.
 *
 * New and duplicate addresses intentionally receive the same response so the
 * route cannot be used to enumerate existing subscribers. Requests are rate limited
 * per client before any parsing, database, or email work happens.
 */
export const POST = withRaft(async (request) => {
  const limit = rateLimiter.check(getClientKey(request.headers));

  if (!limit.allowed) {
    return RaftResponse.json(
      {
        error: "Too Many Requests",
        message: `Too many attempts. Please try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s).`,
      },
      429
    );
  }

  const body = await request.json().catch(() => null);

  if (typeof body?.email !== "string") {
    return RaftResponse.badRequest("A valid email address is required.");
  }

  const result = await waitlistService.join({ email: body.email });

  if (!result.ok) {
    return RaftResponse.badRequest("A valid email address is required.");
  }

  // Keep this response identical for new and duplicate addresses.
  return RaftResponse.ok({
    success: true,
    message: "Thanks, you are on the CxC waiting list.",
  });
});
