import "server-only";

import { WaitlistRepository } from "./waitlist.repository";

const MAX_EMAIL_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Result of a waitlist submission; `isNew` is never returned to the client. */
export type WaitlistResult =
  { ok: true; isNew: boolean } | { ok: false; reason: "invalid_email" };

/** Validates and normalizes public waitlist submissions. */
export class WaitlistService {
  private readonly repository = new WaitlistRepository();

  async join(input: { email: string }): Promise<WaitlistResult> {
    const email = input.email.trim().toLowerCase();

    // Normalization makes case variants collide with the email primary key.
    if (email.length === 0 || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
      return { ok: false, reason: "invalid_email" };
    }

    return { ok: true, isNew: await this.repository.insertIfNew(email) };
  }
}
