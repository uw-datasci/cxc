import { RaftResponse } from "@uw-datasci/raft";

import { withAuth } from "@/lib/auth/guard";
import { ApplicationService } from "@/server/applications/applications.service";
import { APPLICATION_STEPS, type ApplicationStep } from "@/types/application";

type Params = { step: string };

/**
 * Saves one step of the caller's draft: `profile`, `personal`, or `questions`. The body
 * holds that step's fields; omitted fields are cleared. Creates the draft on first save.
 */
export const PUT = withAuth<Params>(async (request, { params }, auth) => {
  const { step } = await params;
  if (!isStep(step)) return RaftResponse.notFound();

  const body: unknown = await request.json().catch(() => null);
  if (body === null) return RaftResponse.badRequest("Body must be valid JSON.");

  const result = await new ApplicationService(auth.userId).saveStep(step, body);
  if (result.ok) return RaftResponse.ok(result.application);

  if (result.reason === "already_submitted") {
    return RaftResponse.json(
      { error: "Conflict", message: "This application has already been submitted." },
      409
    );
  }
  return RaftResponse.badRequest(result.message);
});

function isStep(value: string): value is ApplicationStep {
  return (APPLICATION_STEPS as readonly string[]).includes(value);
}
