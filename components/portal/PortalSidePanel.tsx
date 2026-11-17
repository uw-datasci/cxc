import Image from "next/image";

import { PortalArtwork } from "@/components/portal/PortalArtwork";
import { cn } from "@/lib/utils";

type PortalSidePanelProps = {
  wordmark?: boolean;
  className?: string;
};

/**
 * Desktop graphics panel of the application portal: logos, rings, terrain, and markers.
 *
 * Positions are the Figma "Left panel" coordinates (CxC W27, node 1355:40865), 463 × 830.
 * The artwork is anchored to the bottom so the terrain always meets the bottom edge; on
 * viewports shorter than the Figma frame the top of the artwork is cropped instead.
 *
 * The welcome screens show a large CxC logo in the content column, so they hide the
 * panel's small wordmark with `wordmark={false}`.
 */
export function PortalSidePanel({ wordmark = true, className }: PortalSidePanelProps) {
  return (
    <aside
      aria-hidden
      className={cn("sticky top-0 h-dvh w-[463px] shrink-0 overflow-hidden", className)}
    >
      <Image
        src="/home/dsc-logo.svg"
        alt=""
        width={55}
        height={52}
        className="absolute top-6.25 left-6.25"
      />
      {wordmark && (
        <Image
          src="/portal/cxc-wordmark.svg"
          alt=""
          width={154}
          height={44}
          className="absolute top-[29px] left-[285px]"
        />
      )}

      <PortalArtwork />
    </aside>
  );
}
