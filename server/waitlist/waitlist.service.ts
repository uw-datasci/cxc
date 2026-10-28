import "server-only";

import { createElement } from "react";

import { emailService } from "@/server/email/email.service";
import {
  WAITLIST_CONFIRMATION_SUBJECT,
  WaitlistConfirmationEmail,
  waitlistConfirmationText,
} from "@/server/email/templates/waitlist-confirmation";

import { WaitlistRepository } from "./waitlist.repository";

const MAX_EMAIL_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Result of a waitlist submission; `isNew` is never returned to the client. */
export type WaitlistResult =
  { ok: true; isNew: boolean } | { ok: false; reason: "invalid_email" };

/**
 * Validates and normalizes public waitlist submissions.
 *
 * Waitlist signups have no authenticated user, so unlike `UserService` this service
 * holds no per-user state. Use the shared {@link waitlistService} instance rather than
 * constructing one per request.
 */
export class WaitlistService {
  private readonly repository = new WaitlistRepository();

  async join(input: { email: string }): Promise<WaitlistResult> {
    const email = input.email.trim().toLowerCase();

    // Normalization makes case variants collide with the email primary key.
    if (email.length === 0 || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
      return { ok: false, reason: "invalid_email" };
    }

    const isNew = await this.repository.insertIfNew(email);

    // Only newly added addresses are emailed, so duplicates cannot be used to spam a
    // subscriber's inbox.
    if (isNew) {
      try {
        await emailService.send({
          to: email,
          subject: WAITLIST_CONFIRMATION_SUBJECT,
          template: createElement(WaitlistConfirmationEmail, { email }),
          text: waitlistConfirmationText(email),
        });
      } catch (error) {
        // The signup itself succeeded; a failed confirmation must not fail the request.
        console.error("Waitlist confirmation email failed.", error);
      }
    }

    return { ok: true, isNew };
  }
}

/** Shared instance for route handlers. */
export const waitlistService = new WaitlistService();
