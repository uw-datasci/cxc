import "server-only";

import { Column, Heading, Hr, Row, Section, Text } from "@react-email/components";
import { emailColours, emailFonts } from "../email.theme";
import { EmailLayout } from "./email-layout";

interface WaitlistConfirmationEmailProps {
  email: string;
}

/** Subject line for the waitlist confirmation email. */
export const WAITLIST_CONFIRMATION_SUBJECT = "You're on the CxC waiting list!";

const NEXT_STEPS = [
  "We'll email you as soon as registration opens, with everything you need to register.",
  "There's nothing else you need to do for now.",
  "If you don't see our email when registration opens, check your spam folder.",
] as const;

function footerNote(email: string): string {
  return `You're receiving this because ${email} was added to the CxC waitlist.`;
}

/** Plain-text alternative that mirrors {@link WaitlistConfirmationEmail}. */
export function waitlistConfirmationText(email: string): string {
  return [
    "You're on the list.",
    "",
    "Thanks for signing up for the CxC waitlist.",
    "",
    "WHAT HAPPENS NEXT",
    ...NEXT_STEPS.map((step) => `- ${step}`),
    "",
    footerNote(email),
    "CxC · UWaterloo Data Science Club",
  ].join("\n");
}

/** Small outlined BLUE square used as a bullet, like the markers on the site. */
function Marker() {
  return (
    <div
      style={{
        width: "8px",
        height: "8px",
        marginTop: "7px",
        border: `1px solid ${emailColours.primary}`,
      }}
    />
  );
}

/** Mono uppercase label with a leading marker. */
function SectionLabel({ children }: { children: string }) {
  return (
    <Row>
      <Column style={{ width: "20px", verticalAlign: "top" }}>
        <Marker />
      </Column>
      <Column>
        <Text
          style={{
            margin: 0,
            fontFamily: emailFonts.mono,
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          {children}
        </Text>
      </Column>
    </Row>
  );
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
    <EmailLayout
      preview="We'll email you as soon as registration opens."
      footerNote={footerNote(email)}
    >
      <Section style={{ padding: "40px 32px 8px" }}>
        <SectionLabel>01 — Confirmed</SectionLabel>
        <Heading
          as="h1"
          style={{
            margin: "20px 0 0",
            fontSize: "36px",
            lineHeight: 1.1,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          You&apos;re on the list.
        </Heading>
        <Text style={{ margin: "16px 0 0", fontSize: "16px", lineHeight: 1.6 }}>
          Thanks for signing up for the CxC waitlist.
        </Text>
      </Section>

      <Section style={{ padding: "24px 32px 0" }}>
        <Hr style={{ margin: 0, borderColor: emailColours.border }} />
      </Section>

      <Section style={{ padding: "24px 32px 40px" }}>
        <SectionLabel>02 — What happens next</SectionLabel>
        <div style={{ height: "12px" }} />
        {NEXT_STEPS.map((step) => (
          <Row key={step}>
            <Column style={{ width: "20px", verticalAlign: "top" }}>
              <Marker />
            </Column>
            <Column>
              <Text style={{ margin: "0 0 12px", fontSize: "15px", lineHeight: 1.6 }}>
                {step}
              </Text>
            </Column>
          </Row>
        ))}
      </Section>
    </EmailLayout>
  );
}
