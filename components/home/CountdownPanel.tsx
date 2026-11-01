"use client";

import { CaretDownIcon } from "@phosphor-icons/react";

import { useCountdown } from "@/lib/hooks/useCountdown";
import { cn } from "@/lib/utils";

/**
 * TODO: placeholder until the application release date is confirmed.
 */
const CXC_START = "2026-12-06T09:00:00-05:00";

const UNITS = ["DAYS", "HOURS", "MINUTES", "SECONDS"] as const;

/** Shown before the first client tick, so server and client markup match. */
const PLACEHOLDER = "--";

/** Two-digit display value, as in the mockup: `3` renders as `03`. */
function formatUnit(value: number): string {
  return value.toString().padStart(2, "0");
}

interface CountdownPanelProps {
  /** ISO string with an explicit UTC offset. */
  target?: string;
  className?: string;
}

export function CountdownPanel({ target = CXC_START, className }: CountdownPanelProps) {
  const remaining = useCountdown(target);
  const values = remaining
    ? [remaining.days, remaining.hours, remaining.minutes, remaining.seconds].map(formatUnit)
    : UNITS.map(() => PLACEHOLDER);

  return (
    <section
      aria-labelledby="countdown-heading"
      className={cn("w-full max-w-4xl animate-boot-fade motion-reduce:animate-none", className)}
    >
      <h2 id="countdown-heading" className="sr-only">
        Time until CxC
      </h2>

      {/* One polite live region for the whole timer; seconds are left out so it
          announces about once a minute rather than every second. */}
      <p className="sr-only" aria-live="polite">
        {remaining
          ? `${remaining.days} days, ${remaining.hours} hours and ${remaining.minutes} minutes until CxC begins.`
          : "Loading countdown."}
      </p>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-8">
        {UNITS.map((label, index) => (
          <div key={label} className="flex flex-col items-center gap-2.5">
            {/* Figma: 173 x 224. Held as a ratio so the card can scale with the page. */}
            <div className="flex aspect-173/224 w-full items-center justify-center border border-border bg-card">
              {/* Deliberately not `tabular-nums`: Alte Haas sets its tabular `1` right of
                  its cell and the other digits left, dragging any value without a leading
                  `1` off centre. Its default figures are near-uniform, so nothing reflows. */}
              <span
                aria-hidden
                className="text-5xl font-bold text-primary sm:text-6xl md:text-7xl"
              >
                {values[index]}
              </span>
            </div>

            {/* 8 x 16 triangle rotated 90deg, in SMOKE — it reads against the terrain. */}
            <CaretDownIcon aria-hidden weight="fill" className="h-2 w-4 text-card" />

            {/* Figma: Atkinson Hyperlegible Bold 18px, no extra tracking, DARK GREY. */}
            <div className="flex h-8 w-full items-center justify-center border border-border bg-card font-mono text-xs font-bold text-dark-grey uppercase sm:text-sm md:text-lg">
              [{label}]
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
