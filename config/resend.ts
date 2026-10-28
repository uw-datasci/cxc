import "server-only";

import { Resend } from "resend";

import { serverConfig } from "./server";

/**
 * Shared Resend client, backed by `RESEND_API_KEY`.
 *
 * Do not use this export directly from routes or domain services. Send mail through
 * `emailService` (`server/email/email.service.ts`) so every transactional email goes
 * through the same rendering, sender address, and error handling.
 */
export const resend = new Resend(serverConfig.resendApiKey);
