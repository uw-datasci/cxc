import { RaftResponse } from "@uw-datasci/raft";

import { withAuth } from "@/lib/auth/guard";
import { ApplicationService } from "@/server/applications/applications.service";

/** The caller's application (draft or submitted), or 404 if they have not started one. */
export const GET = withAuth(async (_request, _context, auth) => {
  const application = await new ApplicationService(auth.userId).getMine();
  if (!application) return RaftResponse.notFound("No application yet");
  return RaftResponse.ok(application);
});
