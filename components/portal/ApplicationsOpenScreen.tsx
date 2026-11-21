import Image from "next/image";
import Link from "next/link";

import { PortalArtwork } from "@/components/portal/PortalArtwork";
import { PortalMobileTerrain } from "@/components/portal/PortalMobileTerrain";
import { Button } from "@/components/ui/button";

/**
 * "Applications now open" entry screen of the portal
 *
 */
export function ApplicationsOpenScreen() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-card text-foreground">
      <PortalArtwork variant="wide" className="hidden lg:block" />

      <header className="relative h-21.75 shrink-0 lg:absolute lg:inset-x-0 lg:top-0">
        <Image
          src="/home/dsc-logo.svg"
          alt="UW Data Science Club"
          width={55}
          height={52}
          className="absolute top-6.25 left-6.25 h-10.25 w-auto lg:h-13"
        />
      </header>

      <main className="relative flex flex-1 flex-col items-center px-6 pt-21.75 pb-14 lg:items-start lg:justify-end lg:pt-24 lg:pr-10 lg:pb-59 lg:pl-[53%]">
        <div className="flex w-full max-w-sm flex-col items-center text-center lg:max-w-none lg:items-start lg:text-left">
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
            width={448}
            height={131}
            className="hidden h-28 w-96 lg:block xl:h-[130.667px] xl:w-112"
          />

          <h1 className="mt-17.75 text-5xl leading-normal font-normal text-dark-grey lg:mt-4 lg:text-7xl lg:font-bold lg:text-foreground xl:text-8xl">
            Welcome!
          </h1>
          <p className="mt-1.25 flex items-center gap-3 font-mono text-base uppercase lg:mt-0 lg:gap-3.75 lg:text-xl xl:text-2xl">
            <span aria-hidden className="flex size-4 items-center justify-center lg:size-5">
              <span className="size-2.75 rotate-45 bg-primary lg:size-3.5" />
            </span>
            Applications now open
          </p>

          <Button
            asChild
            className="mt-7.25 h-14 w-full text-base lg:mt-8 lg:h-16 lg:w-99.75 lg:text-xl"
          >
            <Link href="/apply/welcome">Start application</Link>
          </Button>
        </div>
      </main>

      <PortalMobileTerrain className="lg:hidden" />
    </div>
  );
}
