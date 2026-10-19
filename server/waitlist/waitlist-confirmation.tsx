import "server-only";

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import { waitlistEmailColors } from "./waitlist-email.theme";

interface WaitlistConfirmationEmailProps {
  email: string;
}

/**
 * Branded confirmation email for a newly created waitlist entry.
 *
 * The recipient's address appears in the footer as the reason they received
 * this message, since signups are single opt-in and anyone can enter an
 * address that is not their own.
 */
export function WaitlistConfirmationEmail({ email }: WaitlistConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>We&apos;ll email you as soon as registration opens.</Preview>
      <Body
        style={{
          margin: 0,
          backgroundColor: waitlistEmailColors.background,
          color: waitlistEmailColors.foreground,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <Container
          style={{
            maxWidth: "640px",
            margin: "32px auto",
            backgroundColor: waitlistEmailColors.card,
            border: `1px solid ${waitlistEmailColors.border}`,
          }}
        >
          <Section
            style={{
              padding: "24px 28px",
              backgroundColor: waitlistEmailColors.primary,
              color: waitlistEmailColors.card,
            }}
          >
            <Text
              style={{
                margin: 0,
                fontFamily: "'Courier New', monospace",
                fontSize: "12px",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              CxC · UWaterloo Data Science Club
            </Text>
          </Section>

          <Section style={{ padding: "40px 28px 16px" }}>
            <Heading
              as="h1"
              style={{
                margin: 0,
                fontSize: "32px",
                lineHeight: 1.15,
                fontWeight: 700,
              }}
            >
              You&apos;re on the CxC waitlist.
            </Heading>
          </Section>

          <Section
            style={{
              padding: "0 28px 32px",
              fontSize: "15px",
              lineHeight: 1.7,
            }}
          >
            <Text style={{ margin: "0 0 20px" }}>
              Thanks for signing up. We&apos;ll email you when registration opens, with the
              details you need to register.
            </Text>

            <Text style={{ margin: 0 }}>
              There&apos;s nothing else you need to do for now. If you don&apos;t see our email
              when registration opens, check your spam folder.
            </Text>
          </Section>

          <Hr style={{ margin: 0, borderColor: waitlistEmailColors.border }} />
          <Section style={{ padding: "18px 28px" }}>
            <Text
              style={{
                margin: 0,
                color: waitlistEmailColors.muted,
                fontSize: "12px",
                lineHeight: 1.6,
                wordBreak: "break-word",
              }}
            >
              You&apos;re receiving this because {email} was added to the CxC waitlist.
              <br />
              CxC · UWaterloo Data Science Club
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
