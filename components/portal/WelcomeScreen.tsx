import Image from "next/image";
import Link from "next/link";

import { PortalMobileTerrain } from "@/components/portal/PortalMobileTerrain";
import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";

/**
 * Welcome screen of the application portal (Figma CxC W27 "Welcome" 1355:39633 and mobile
 * "Welcome page" 1355:37159): Sign Up for new applicants, "Continue application" (sign in)
 * for returning ones.
 *
 * Desktop: the content sits at the bottom of the right column, in line with the
 * bottom-anchored side-panel artwork. Mobile: centred content above a terrain strip.
 */
export function WelcomeScreen() {
  return (
    <PortalShell wordmark={false}>
      <main className="flex flex-1 flex-col items-center px-6 pt-21.75 pb-14 lg:items-start lg:justify-end lg:px-11.25 lg:pt-24 lg:pb-11">
        <div className="flex w-full max-w-sm flex-col items-center text-center lg:max-w-181.5 lg:items-start lg:text-left">
          <Image
            src="/portal/cxc-wordmark.svg"
            alt="CxC"
            width={217}
            height={62}
            className="h-15.5 w-54.25 lg:hidden"
          />
          <Image
            src="/portal/cxc-logo.svg"
            alt="CxC"
            width={384}
            height={112}
            className="hidden h-28 w-96 lg:block"
          />

          <h1 className="mt-17.75 text-5xl leading-normal font-normal text-dark-grey lg:mt-14.75 lg:text-6xl lg:font-bold">
            Welcome!
          </h1>
          <p className="mt-1.25 text-lg text-muted-foreground lg:mt-0 lg:text-xl">
            Sign up to access applicant dashboard
          </p>

          <Button
            asChild
            className="mt-7.25 h-14 w-full text-base lg:mt-5 lg:h-16 lg:w-99.75 lg:text-xl"
          >
            <Link href="/sign-up">Sign Up</Link>
          </Button>

          <hr className="mt-9.75 w-full border-t-2 border-border lg:mt-11.5" />

          <p className="mt-9.75 text-lg text-muted-foreground lg:mt-5 lg:text-xl">
            Already have an account?
            <br />
            <Link
              href="/sign-in"
              className="font-bold text-primary underline underline-offset-2 hover:text-dark-blue"
            >
              Continue application
            </Link>
          </p>
        </div>
      </main>
      <PortalMobileTerrain className="lg:hidden" />
    </PortalShell>
  );
}
