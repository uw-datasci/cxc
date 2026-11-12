import { RaftResponse } from "@uw-datasci/raft";

import { withAuth } from "@/lib/auth/guard";
import { ApplicationService } from "@/server/applications/applications.service";

/** Submits the caller's draft. Fails with the list of missing fields if it is incomplete. */
export const POST = withAuth(async (_request, _context, auth) => {
  const result = await new ApplicationService(auth.userId).submit();
  if (result.ok) return RaftResponse.ok(result.application);

  switch (result.reason) {
    case "not_started":
      return RaftResponse.notFound("No application yet");
    case "already_submitted":
      return RaftResponse.json(
        { error: "Conflict", message: "This application has already been submitted." },
        409
      );
    case "incomplete":
      return RaftResponse.json(
        {
          error: "Bad Request",
          message: "Some required fields are missing.",
          missing: result.missing,
        },
        400
      );
  }
});
