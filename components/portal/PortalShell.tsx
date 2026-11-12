import Image from "next/image";
import type { ReactNode } from "react";

import { PortalSidePanel } from "@/components/portal/PortalSidePanel";
import { cn } from "@/lib/utils";

/**
 * Shared frame of every application-portal screen (Figma: CxC W27 "Lighter bg revised").
 *
 * - Desktop (`lg`+): the graphics panel stays pinned on the left while the right column
 *   scrolls; a GRID GREY rule separates them.
 * - Mobile: no graphics panel; the logos sit in a header above the content.
 *
 * The right column is a full-height flex column, so a pinned {@link StepNav} at the end of
 * `children` sits at the bottom of short pages and stays on screen on long ones.
 */
export function PortalShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-dvh bg-card text-foreground lg:flex">
      <PortalSidePanel className="hidden lg:block" />
      <div
        className={cn(
          "flex min-h-dvh min-w-0 flex-1 flex-col lg:border-l lg:border-border",
          className
        )}
      >
        <PortalMobileHeader className="lg:hidden" />
        {children}
      </div>
    </div>
  );
}

/** Mobile logo header (Figma "Frame 236"): DSC logo on the left, CxC wordmark centred. */
function PortalMobileHeader({ className }: { className?: string }) {
  return (
    <header className={cn("relative h-[87px] shrink-0", className)}>
      <Image
        src="/home/dsc-logo.svg"
        alt="UW Data Science Club"
        width={43}
        height={41}
        className="absolute top-6.25 left-6.25"
      />
      <Image
        src="/portal/cxc-wordmark.svg"
        alt="CxC"
        width={144}
        height={41}
        className="absolute top-[46px] left-1/2 h-[41px] w-[143.5px] -translate-x-1/2"
      />
    </header>
  );
}
