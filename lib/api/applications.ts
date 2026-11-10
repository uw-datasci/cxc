import type { Application, ApplicationStep } from "@/types/application";

/** Error from the applications API, with the fields still missing when submit is refused. */
export class ApplicationApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly missing: string[] = []
  ) {
    super(message);
  }
}

async function parse(response: Response): Promise<Application> {
  if (response.ok) return response.json() as Promise<Application>;

  const body = (await response.json().catch(() => null)) as {
    error?: string;
    message?: string;
    missing?: string[];
  } | null;
  throw new ApplicationApiError(
    body?.message ?? body?.error ?? `Request failed (${response.status})`,
    response.status,
    body?.missing
  );
}

/** The signed-in user's application, or `null` if they have not started one. */
export async function fetchMyApplication(): Promise<Application | null> {
  const response = await fetch("/api/applications");
  if (response.status === 404) return null;
  return parse(response);
}

/** Saves one step of the draft. Send every field of the step; omitted fields are cleared. */
export async function saveApplicationStep(
  step: ApplicationStep,
  fields: Record<string, unknown>
): Promise<Application> {
  return parse(
    await fetch(`/api/applications/steps/${step}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    })
  );
}

/** Submits the draft. Throws `ApplicationApiError` with `missing` when it is incomplete. */
export async function submitApplication(): Promise<Application> {
  return parse(await fetch("/api/applications/submit", { method: "POST" }));
}
