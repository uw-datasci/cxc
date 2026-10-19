import "server-only";

import { createElement } from "react";
import { render } from "@react-email/render";
import { Resend } from "resend";

import { serverConfig } from "@/config/server";

import { WaitlistConfirmationEmail } from "./waitlist-confirmation";

const resend = new Resend(serverConfig.resendApiKey);

function getResendErrorMessage(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return undefined;
}

async function createWaitlistEmail(email: string): Promise<{ html: string; text: string }> {
  return {
    html: await render(createElement(WaitlistConfirmationEmail, { email })),
    text: [
      "You're on the CxC waiting list.",
      "",
      "Thanks for joining the CxC waiting list. We'll keep you updated when registration opens and share important event announcements.",
      "",
      `Registered email: ${email}`,
      "",
      "Keep an eye on your inbox. We look forward to seeing you at CxC.",
    ].join("\n"),
  };
}

class WaitlistEmailService {
  async sendConfirmation(email: string): Promise<void> {
    const content = await createWaitlistEmail(email);
    const { error } = await resend.emails.send({
      from: serverConfig.resendFromEmail,
      to: email,
      subject: "You're on the CxC waiting list!",
      html: content.html,
      text: content.text,
    });

    if (error) {
      const message = getResendErrorMessage(error) ?? "Unknown Resend error";
      console.error("Failed to send the waitlist confirmation email:", message);
      throw new Error("The waitlist confirmation email could not be sent.");
    }
  }
}

const waitlistEmailService = new WaitlistEmailService();

/**
 * Sends the informational email for a newly created waitlist entry.
 *
 * This is intentionally called only after the repository confirms that the
 * address was inserted for the first time.
 */
export async function sendWaitlistConfirmation(email: string): Promise<void> {
  return waitlistEmailService.sendConfirmation(email);
}
