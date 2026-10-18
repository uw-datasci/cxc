"use client";

import { useEffect, useState } from "react";

import { RADAR_START_MS, RADAR_SWEEP_MS } from "@/components/home/Reticle";
import { cn } from "@/lib/utils";

const UPDATE_MS = 100;

/** Reads the sweep's current bearing straight off its CSS animation, so the two never drift. */
function sweepBearing(sweep: Element) {
  const time = sweep.getAnimations()[0]?.currentTime;
  if (typeof time !== "number") return null;
  const elapsed = Math.max(time - RADAR_START_MS, 0);
  return Math.floor(((elapsed % RADAR_SWEEP_MS) / RADAR_SWEEP_MS) * 360);
}

/** Mono HUD line with the station's coordinates and the live sweep bearing. */
export function RadarReadout({ className }: Readonly<{ className?: string }>) {
  const [bearing, setBearing] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sweep = document.querySelector("[data-radar-sweep]");
    if (!sweep) return;

    const timer = window.setInterval(() => setBearing(sweepBearing(sweep)), UPDATE_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <p
      aria-hidden
      className={cn(
        "flex items-center gap-3 bg-background px-2 py-1 font-mono text-xs tracking-widest whitespace-nowrap uppercase",
        className
      )}
    >
      <span className="size-2 border-2 border-primary bg-primary" />
      <span className="hidden sm:inline">Radar</span>
      <span>43.4723° N 080.5449° W</span>
      <span className="w-[8ch]">
        SWP {bearing === null ? "---" : `${String(bearing).padStart(3, "0")}°`}
      </span>
    </p>
  );
}
