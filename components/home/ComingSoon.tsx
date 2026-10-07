import Image from "next/image";
import type { CSSProperties } from "react";

import { DossierPanel } from "@/components/home/DossierPanel";
import { CompassNeedle, Reticle } from "@/components/home/Reticle";
import { TargetLockProvider, TargetReadout, TargetReticle } from "@/components/home/TargetLock";
import { cn } from "@/lib/utils";

// Decor is laid out in the coordinates of the Figma frame (1169:24809), then scaled to cover
// the viewport, so positions below are copied straight from the design.
const FRAME_W = 1280;
const FRAME_H = 832;

function place(x: number, y: number, w: number, h: number): CSSProperties {
  return {
    left: `${(x / FRAME_W) * 100}%`,
    top: `${(y / FRAME_H) * 100}%`,
    width: `${(w / FRAME_W) * 100}%`,
    height: `${(h / FRAME_H) * 100}%`,
  };
}

const TERRAIN = { w: 1014.72, h: 1125.95 };

/** When the boot-in finishes and the status lights take over. */
const STATUS_START_S = 1.8;

// `light` is each marker's offset (s) in the 14s status-light cycle. The gaps are uneven and
// the order hops around the frame, so exactly one marker is lit at a time, irregularly.
const MARKERS = [
  { x: 1030, y: 33, light: 4.6 },
  { x: 1049, y: 33, light: 10.5 },
  { x: 162, y: 136, light: 0 },
  { x: 181, y: 136, light: 6.5 },
  { x: 1204, y: 127, light: 12.9 },
  { x: 1239, y: 127, light: 2.3 },
  { x: 1239, y: 163, light: 9.2 },
  { x: 1185, y: 438, light: 5.7 },
  { x: 1189, y: 710, light: 0.7 },
  { x: 24, y: 653, light: 11.4 },
  { x: 24, y: 669, light: 3.2 },
  { x: 24, y: 686, light: 8.2 },
];

// Hairlines, resolved from Figma's rotated line nodes. `from` is the end next to a marker,
// which is where each line draws out from on load.
const LINES = [
  { x: 838, y: 28, length: 182, axis: "x", from: "right" },
  { x: 191, y: 141, length: 182, axis: "x", from: "left" },
  { x: 1243, y: 184, length: 56, axis: "y", from: "top" },
  { x: 1189, y: 446, length: 83, axis: "y", from: "top" },
  { x: 1194, y: 725, length: 43, axis: "y", from: "top" },
  { x: 1206, y: 715, length: 43, axis: "x", from: "left" },
  { x: 30, y: 447, length: 192, axis: "y", from: "bottom" },
] as const;

const originClass = {
  left: "origin-left",
  right: "origin-right",
  top: "origin-top",
  bottom: "origin-bottom",
} as const;

export function ComingSoon() {
  return (
    <TargetLockProvider>
      <main className="relative isolate min-h-svh overflow-hidden">
        <div
          aria-hidden
          className="[container-type:size] pointer-events-none absolute inset-0 overflow-hidden"
        >
          {/* Covers the viewport like object-fit: cover. Narrow screens crop toward the right
              (x 90%) so the target-lock reticle stays in view. */}
          <div className="absolute top-1/2 left-[calc((100cqw-var(--stage-w))*0.9)] aspect-[1280/832] w-(--stage-w) -translate-y-1/2 [--stage-w:max(100cqw,calc(100cqh*1280/832))]">
            <div
              className="absolute animate-boot-fade motion-reduce:animate-none"
              style={{ ...place(64, -17, 514, 514), animationDelay: "100ms" }}
            >
              <Reticle variant="compass" />
            </div>

            <div className="absolute" style={place(440, -184, TERRAIN.w, TERRAIN.h)}>
              <Image src="/home/terrain.svg" alt="" fill unoptimized />
            </div>
            {/* Figma reuses the same terrain, mirrored, for the top-left landmass. */}
            <div
              className="absolute -scale-x-100"
              style={place(564.72 - TERRAIN.w, -553, TERRAIN.w, TERRAIN.h)}
            >
              <Image src="/home/terrain.svg" alt="" fill unoptimized />
            </div>

            {/* The needle sits above the terrain; the compass rings stay below, as in Figma. */}
            <div
              className="absolute animate-boot-fade motion-reduce:animate-none"
              style={{ ...place(64, -17, 514, 514), animationDelay: "100ms" }}
            >
              <CompassNeedle />
            </div>

            <div
              className="absolute animate-boot-fade motion-reduce:animate-none"
              style={{ ...place(963, 412, 372, 372), animationDelay: "250ms" }}
            >
              <TargetReticle>
                <Reticle variant="target" />
              </TargetReticle>
            </div>

            {LINES.map((line, i) => (
              <span
                key={`${line.x}-${line.y}`}
                className={cn(
                  "absolute bg-foreground motion-reduce:animate-none",
                  line.axis === "x" ? "h-px animate-draw-x" : "w-px animate-draw-y",
                  originClass[line.from]
                )}
                style={{
                  left: `${(line.x / FRAME_W) * 100}%`,
                  top: `${(line.y / FRAME_H) * 100}%`,
                  [line.axis === "x" ? "width" : "height"]:
                    `${(line.length / (line.axis === "x" ? FRAME_W : FRAME_H)) * 100}%`,
                  animationDelay: `${500 + i * 60}ms`,
                }}
              />
            ))}

            {MARKERS.map((marker, i) => (
              <span
                key={`${marker.x}-${marker.y}`}
                className="absolute animate-pop-in border-2 border-primary motion-reduce:animate-none"
                style={{
                  ...place(marker.x, marker.y, 9, 9),
                  animationDelay: `${200 + i * 40}ms`,
                }}
              >
                <span
                  className="absolute inset-0 animate-status-light bg-primary opacity-0 motion-reduce:hidden"
                  style={{ animationDelay: `${STATUS_START_S + marker.light}s` }}
                />
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex min-h-svh flex-col items-center gap-22 px-4 pt-32 pb-24">
          <a
            href="https://uwdatascience.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 left-4 bg-background p-2 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Image src="/home/dsc-logo.svg" alt="UW Data Science Club" width={55} height={52} />
          </a>

          <h1>
            <Image
              src="/home/cxc-logo.svg"
              alt="CxC"
              width={343}
              height={100}
              loading="eager"
              className="h-auto w-60 md:w-[343px]"
            />
            <span className="sr-only"> — UWaterloo Data Science Club AI datathon</span>
          </h1>

          <DossierPanel />

          <TargetReadout className="absolute right-6 bottom-6" />
        </div>
      </main>
    </TargetLockProvider>
  );
}
