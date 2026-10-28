import "server-only";

import type { ReactElement } from "react";
import { render } from "@react-email/render";

import { resend } from "@/config/resend";
import { serverConfig } from "@/config/server";

/** Everything needed to send one transactional email. */
export interface SendEmailInput {
  to: string;
  subject: string;
  /** React Email template, rendered to the HTML body. */
  template: ReactElement;
  /** Plain-text alternative for clients that do not render HTML. */
  text: string;
}

/**
 * Sends transactional email through Resend.
 *
 * This is the one place that renders templates, picks the sender address, and
 * turns Resend failures into thrown errors. Domain services build their template
 * (see `server/email/templates/`) and call `send`. They should not import
 * `@/config/resend` themselves.
 */
export class EmailService {
  /** Renders the template and sends it. Throws if Resend rejects the message. */
  async send({ to, subject, template, text }: SendEmailInput): Promise<void> {
    const html = await render(template);

    const { error } = await resend.emails.send({
      from: serverConfig.resendFromEmail,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      // Log the provider detail server-side only. The thrown message can reach clients.
      console.error(`Failed to send the "${subject}" email:`, error.message);
      throw new Error(`The "${subject}" email could not be sent.`);
    }
  }
}

/** Shared instance; the service holds no per-request state. */
export const emailService = new EmailService();
