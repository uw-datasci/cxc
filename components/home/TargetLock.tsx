"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { targetCenter } from "@/components/home/Reticle";
import { cn } from "@/lib/utils";

/** Reticle offsets (% of its own box) and the coordinates each one "locks" onto. */
const WAYPOINTS = [
  { x: 0, y: 0, lat: 43.4723, lon: 80.5449 },
  { x: -9, y: -12, lat: 43.4643, lon: 80.5204 },
  { x: 7, y: -6, lat: 43.4516, lon: 80.4925 },
] as const;

const START_MS = 2400;
const TRAVEL_MS = 1600;
const HOLD_MS = 3200;

type LockState = { index: number; from: number; tracking: boolean };

const initialState: LockState = { index: 0, from: 0, tracking: false };

const LockContext = createContext<LockState>(initialState);

/** Drives the target reticle: hold on a waypoint, travel to the next, lock, repeat. */
export function TargetLockProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [state, setState] = useState<LockState>(initialState);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number;
    const holdThenTravel = (index: number, delay: number) => {
      timer = window.setTimeout(() => {
        const next = (index + 1) % WAYPOINTS.length;
        setState({ index: next, from: index, tracking: true });
        timer = window.setTimeout(() => {
          setState({ index: next, from: index, tracking: false });
          holdThenTravel(next, HOLD_MS);
        }, TRAVEL_MS);
      }, delay);
    };

    holdThenTravel(0, START_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return <LockContext value={state}>{children}</LockContext>;
}

/** Wraps the reticle so it drifts between waypoints and shows lock brackets when settled. */
export function TargetReticle({ children }: Readonly<{ children: ReactNode }>) {
  const { index, tracking } = useContext(LockContext);
  const waypoint = WAYPOINTS[index];
  const origin = `${targetCenter.x}% ${targetCenter.y}%`;

  return (
    <div
      className="relative size-full transition-transform ease-in-out motion-reduce:transition-none"
      style={{
        transform: `translate(${waypoint.x}%, ${waypoint.y}%)`,
        transitionDuration: `${TRAVEL_MS}ms`,
      }}
    >
      {children}
      <svg
        aria-hidden
        viewBox="0 0 372 372"
        fill="none"
        className={cn(
          "absolute inset-0 size-full animate-pop-in overflow-visible stroke-primary transition-[opacity,scale] duration-200 ease-out motion-reduce:animate-none motion-reduce:transition-none",
          tracking ? "scale-140 opacity-0" : "scale-100 opacity-100",
        )}
        style={{ transformOrigin: origin, animationDelay: "900ms" }}
      >
        <LockMarks cx={185.271} cy={189.647} />
      </svg>
    </div>
  );
}

/** Four corner brackets around the centre, plus a gapped cross-hair. */
function LockMarks({ cx, cy }: Readonly<{ cx: number; cy: number }>) {
  const half = 52;
  const arm = 14;
  const corners = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ] as const;

  return (
    <g strokeWidth={2}>
      {corners.map(([sx, sy]) => (
        <path
          key={`${sx}${sy}`}
          d={`M${cx + sx * half} ${cy + sy * (half - arm)}V${cy + sy * half}H${cx + sx * (half - arm)}`}
        />
      ))}
      <path
        d={`M${cx - 18} ${cy}H${cx - 7}M${cx + 7} ${cy}H${cx + 18}M${cx} ${cy - 18}V${cy - 7}M${cx} ${cy + 7}V${cy + 18}`}
      />
    </g>
  );
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

/** Mono HUD line with the current target's coordinates; ticks while the reticle travels. */
export function TargetReadout({ className }: Readonly<{ className?: string }>) {
  const { index, from, tracking } = useContext(LockContext);
  const [live, setLive] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (!tracking) return;

    const a = WAYPOINTS[from];
    const b = WAYPOINTS[index];
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const t = easeInOut(Math.min((now - start) / TRAVEL_MS, 1));
      setLive({ lat: a.lat + (b.lat - a.lat) * t, lon: a.lon + (b.lon - a.lon) * t });
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [index, from, tracking]);

  const coords = tracking && live ? live : WAYPOINTS[index];

  return (
    <p
      aria-hidden
      className={cn(
        "flex items-center gap-3 bg-background px-2 py-1 font-mono text-xs tracking-widest whitespace-nowrap uppercase",
        className,
      )}
    >
      <span className={cn("size-2 border-2 border-primary", !tracking && "bg-primary")} />
      <span className="hidden sm:inline">TGT-0{index + 1}</span>
      <span>
        {coords.lat.toFixed(4)}° N {coords.lon.toFixed(4).padStart(8, "0")}° W
      </span>
      <span className="w-[8ch]">{tracking ? "Tracking" : "Locked"}</span>
    </p>
  );
}
