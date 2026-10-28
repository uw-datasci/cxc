import "server-only";

import type { ReactNode } from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import { emailBrand, emailColours, emailFonts } from "../email.theme";

interface EmailLayoutProps {
  /** Inbox preview text shown next to the subject line. */
  preview: string;
  /** Why the recipient is getting this email, shown in the footer. */
  footerNote: string;
  children: ReactNode;
}

/**
 * Shared frame for every CxC email: a blue header bar, the message body on a SMOKE card,
 * and a dark footer with the sender identity and a link to the site.
 * 
 * Templates pass their body as `children` and should not repeat the header or footer.
 */
export function EmailLayout({ preview, footerNote, children }: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          margin: 0,
          padding: "32px 12px",
          backgroundColor: emailColours.background,
          color: emailColours.foreground,
          fontFamily: emailFonts.sans,
        }}
      >
        <Container
          style={{
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: emailColours.card,
            border: `1px solid ${emailColours.border}`,
          }}
        >
          <Section style={{ padding: "24px 32px", backgroundColor: emailColours.primary }}>
            <Text
              style={{
                margin: 0,
                color: emailColours.card,
                fontSize: "28px",
                lineHeight: 1.1,
                fontWeight: 700,
              }}
            >
              {emailBrand.name}
            </Text>
            <Text
              style={{
                margin: "6px 0 0",
                color: emailColours.card,
                fontFamily: emailFonts.mono,
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              {emailBrand.organization}
            </Text>
          </Section>

          {children}

          <Section style={{ padding: "24px 32px", backgroundColor: emailColours.darkGrey }}>
            <Text
              style={{
                margin: 0,
                color: emailColours.card,
                fontFamily: emailFonts.mono,
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              {emailBrand.name} · {emailBrand.organization}
            </Text>
            <Text
              style={{
                margin: "12px 0 0",
                color: emailColours.card,
                fontSize: "12px",
                lineHeight: 1.6,
                wordBreak: "break-word",
              }}
            >
              {footerNote}
            </Text>
            <Text style={{ margin: "12px 0 0", fontSize: "12px", lineHeight: 1.6 }}>
              <Link
                href={emailBrand.siteUrl}
                style={{ color: emailColours.card, textDecoration: "underline" }}
              >
                {emailBrand.siteLabel}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
