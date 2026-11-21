import Image from "next/image";

import { cn } from "@/lib/utils";

const TERRAIN_OFFSET = {
  panel: "left-[-34px]",
  wide: "left-[-68px]",
} as const;

type PortalArtworkProps = {
  variant?: keyof typeof TERRAIN_OFFSET;
  className?: string;
};

export function PortalArtwork({ variant = "panel", className }: PortalArtworkProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute bottom-0 left-0 h-[830px] w-full", className)}
    >
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
          className={cn(
            "absolute top-0 h-[461.644px] w-[1348px] max-w-none",
            TERRAIN_OFFSET[variant]
          )}
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
  );
}
