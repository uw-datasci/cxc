import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Desktop graphics panel of the application portal: logos, rings, terrain, and markers.
 *
 * Positions are the Figma "Left panel" coordinates (CxC W27, node 1355:40865), 463 × 830.
 * The artwork is anchored to the bottom so the terrain always meets the bottom edge; on
 * viewports shorter than the Figma frame the top of the artwork is cropped instead.
 */
export function PortalSidePanel({ className }: { className?: string }) {
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
      <Image
        src="/portal/cxc-wordmark.svg"
        alt=""
        width={154}
        height={44}
        className="absolute top-[29px] left-[285px]"
      />

      <div className="absolute bottom-0 left-0 h-[830px] w-full">
        {/* Figma flips the rings horizontally. */}
        <Image
          src="/portal/side-rings.svg"
          alt=""
          width={303}
          height={303}
          className="absolute top-[307px] left-[123px] -scale-x-100"
        />
        <div className="absolute top-[454px] left-0 h-[378px] w-full overflow-hidden">
          <Image
            src="/portal/side-terrain.svg"
            alt=""
            width={1348}
            height={462}
            unoptimized
            className="absolute top-0 left-[-34px] h-[461.644px] w-[1348px] max-w-none"
          />
        </div>
        <Image
          src="/portal/side-markers.svg"
          alt=""
          width={454}
          height={340}
          className="absolute top-[183px] left-6.25 max-w-none"
        />
      </div>
    </aside>
  );
}
