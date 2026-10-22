"use client";

import { useSyncExternalStore } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

import { CXC_START, formatUnit, getTimeRemaining } from "@/lib/countdown";
import { cn } from "@/lib/utils";

/**
 * The countdown, built to drop into the slot {@link DossierPanel} occupies.
 *
 * NOT RENDERED YET. It is staged here so that the moment the application
 * release date is confirmed, swapping it in is a two-line change in
 * `ComingSoon.tsx` — the import, and `<DossierPanel />` → `<CountdownPanel />`.
 * It keeps the dossier card's `max-w-4xl` width so the swap moves nothing else
 * on the page.
 *
 * The unit styling reproduces the Figma countdown frame: a SMOKE card holding
 * the numeral, a white caret, then a bordered label strip, stacked with 10px
 * gaps. Unlike the Figma frame it is fluid rather than pinned at 173px wide,
 * because here it has to share a page that scales — the card keeps the design's
 * 173:224 proportions instead.
 */
const UNITS = ["DAYS", "HOURS", "MINUTES", "SECONDS"] as const;

/** Shown before the first client tick, so server and client markup match. */
const PLACEHOLDER = "--";

/*
 * A one-second clock as an external store.
 *
 * `useSyncExternalStore` is the right tool for a value React does not own, and
 * it hydrates cleanly: the server render and the hydration pass both use
 * `getServerSnapshot`, so the markup matches and the live value only arrives
 * afterwards. The snapshot is cached rather than returning `Date.now()` per
 * call, which would look like an endless change to React. One interval is
 * shared by every subscriber and stops when the last one unmounts.
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

export function CountdownPanel({
  target = CXC_START,
  className,
}: {
  /** ISO string with an explicit UTC offset. */
  target?: string;
  className?: string;
}) {
  const targetTime = new Date(target).getTime();

  // Once complete, swapping in a no-op subscribe makes React unsubscribe from
  // the clock, so the interval stops rather than re-rendering zeroes forever.
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
    <section
      aria-labelledby="countdown-heading"
      className={cn(
        "w-full max-w-4xl animate-boot-fade motion-reduce:animate-none",
        className
      )}
    >
      <h2 id="countdown-heading" className="sr-only">
        Time until CxC
      </h2>

      {/*
        One polite live region for the whole timer. Four regions announcing every
        second would be unusable, so seconds are left out and the sentence
        changes about once a minute.
      */}
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
              {/*
                Deliberately not `tabular-nums`: Alte Haas sets its tabular `1`
                to the right of its cell and the other digits to the left, which
                drags any value without a leading `1` off centre. Its default
                figures are already near-uniform in width, so nothing reflows on
                each tick.
              */}
              <span aria-hidden className="text-5xl font-bold text-primary sm:text-6xl md:text-7xl">
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
