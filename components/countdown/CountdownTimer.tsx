"use client";

import { useSyncExternalStore } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

import { formatUnit, getTimeRemaining } from "@/lib/countdown";
import { cn } from "@/lib/utils";

const UNITS = ["Days", "Hours", "Minutes", "Seconds"] as const;

/** Shown before the first client snapshot, so server and client markup match. */
const PLACEHOLDER = "--";

/*
 * A one-second clock as an external store.
 *
 * The timer reads the wall clock, which is exactly the "external system"
 * `useSyncExternalStore` exists for — and unlike an effect that calls
 * `setState`, it hydrates cleanly: React uses `getServerClockSnapshot` for both
 * the server render and the hydration pass, so the markup matches and the live
 * value only arrives afterwards.
 *
 * The snapshot is cached rather than returning `Date.now()` per call; a fresh
 * value every call would look like an endless change to React. One interval is
 * shared by all subscribers and stops when the last one leaves.
 */
let snapshot = Date.now();
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribeToClock(onStoreChange: () => void) {
  listeners.add(onStoreChange);

  timer ??= setInterval(() => {
    snapshot = Date.now();
    for (const listener of listeners) listener();
  }, 1000);

  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

/** Used once the target has passed: nothing left to count down to. */
function subscribeToNothing() {
  return () => {};
}

const getClockSnapshot = () => snapshot;
const getServerClockSnapshot = () => null;

export function CountdownTimer({
  target,
  className,
  style,
}: {
  target: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const targetTime = new Date(target).getTime();

  // Once complete, swapping in a no-op subscribe makes React unsubscribe from
  // the clock, so the interval stops instead of re-rendering zeroes forever.
  const isComplete = snapshot >= targetTime;
  const now = useSyncExternalStore(
    isComplete ? subscribeToNothing : subscribeToClock,
    getClockSnapshot,
    getServerClockSnapshot
  );

  const remaining = now === null ? null : getTimeRemaining(new Date(targetTime), new Date(now));
  const values = remaining
    ? [remaining.days, remaining.hours, remaining.minutes, remaining.seconds].map(formatUnit)
    : UNITS.map(() => PLACEHOLDER);

  return (
    // Figma `Frame 90`: horizontal, hug 932 x 285, 80px gap.
    <div className={cn("flex", className)} style={{ gap: 80, ...style }}>
      {/*
        One polite live region for the whole timer. Four regions announcing
        every second would be unusable, so seconds are left out here and the
        sentence changes about once a minute.
      */}
      <p className="sr-only" aria-live="polite">
        {remaining
          ? `${remaining.days} days, ${remaining.hours} hours and ${remaining.minutes} minutes until CxC begins.`
          : "Loading countdown."}
      </p>

      {UNITS.map((label, index) => (
        <CountdownUnit key={label} label={label} value={values[index]} />
      ))}
    </div>
  );
}

/** Figma `Frame 86`: vertical, 173 wide, 10px gaps — 224 + 8 + 33 = 285 tall. */
function CountdownUnit({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center" style={{ width: 173, gap: 10 }}>
      <div
        className="flex w-full items-center justify-center border border-border bg-card"
        style={{ height: 224 }}
      >
        {/*
          Figma: Alte Haas Grotesk Bold at 100px. `text-8xl` (96px) is the
          closest step on the scale; the guide caps hero numerals there rather
          than using an arbitrary size.

          Deliberately NOT `tabular-nums`. The usual reason to reach for it —
          stopping the number reflowing on each tick — does not apply: this
          font's default figures are already near-uniform (101-103px for any
          two digits, left edge steady across ticks). Turning tabular on makes
          things worse, because Alte Haas sets its tabular `1` to the right of
          its cell and the other digits to the left, so a value with no leading
          `1` lands 8px left of centre while `122` lands dead centre. Without
          it every card sits within ~2px.
        */}
        <span aria-hidden className="text-8xl font-bold text-primary">
          {value}
        </span>
      </div>

      {/* 8 x 16 triangle rotated 90deg, in white — it reads against the artwork. */}
      <CaretDownIcon aria-hidden weight="fill" className="h-2 w-4 text-card" />

      {/* Figma: Atkinson Hyperlegible Bold 18px, no extra tracking, DARK GREY. */}
      <div
        className="flex w-full items-center justify-center border border-border bg-card font-mono text-lg font-bold text-dark-grey"
        style={{ height: 33 }}
      >
        [{label}]
      </div>
    </div>
  );
}
