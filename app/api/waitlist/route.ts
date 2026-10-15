import { RaftResponse, withRaft } from "@uw-datasci/raft";

import { WaitlistService } from "@/server/waitlist/waitlist.service";

/**
 * Public waitlist submission endpoint.
 *
 * New and duplicate addresses intentionally receive the same response so the
 * route cannot be used to enumerate existing subscribers.
 */
export const POST = withRaft(async (request) => {
  const body = await request.json().catch(() => null);

  if (typeof body?.email !== "string") {
    return RaftResponse.badRequest("A valid email address is required.");
  }

  const result = await new WaitlistService().join({ email: body.email });

  if (!result.ok) {
    return RaftResponse.badRequest("A valid email address is required.");
  }

  // Keep this response identical for new and duplicate addresses.
  return RaftResponse.ok({
    success: true,
    message: "Thanks, you are on the CxC waiting list.",
  });
});
