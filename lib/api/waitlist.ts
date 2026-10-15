/** The public response deliberately contains no new-versus-duplicate signal. */
export interface JoinWaitlistResponse {
  success: true;
  message: string;
}

/** Submit an email address to the public waitlist endpoint. */
export async function joinWaitlist(email: string): Promise<JoinWaitlistResponse> {
  const response = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Could not join the waiting list.");
  }

  return response.json() as Promise<JoinWaitlistResponse>;
}
