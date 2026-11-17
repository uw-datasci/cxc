import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Terrain strip along the bottom of the mobile welcome screens (Figma CxC W27 "Welcome page"
 * 1355:37159). The 1011 × 245 artwork is cropped to the 189px visible in the frame, offset
 * 76px to the left as in Figma.
 */
export function PortalMobileTerrain({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative h-[189px] shrink-0 overflow-hidden", className)}>
      <Image
        src="/portal/mobile-terrain.svg"
        alt=""
        width={1011}
        height={245}
        unoptimized
        className="absolute top-0 left-[-76px] h-[245px] w-[1010.89px] max-w-none"
      />
    </div>
  );
}
