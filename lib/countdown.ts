/**
 * Countdown to the start of CxC.
 *
 * Pure date math, no React and no dependencies, so it can be unit tested and
 * reused anywhere the timer shows up (e.g. a strip on the landing page).
 */

/**
 * When CxC begins.
 *
 * The offset is explicit on purpose: without it, the target would be parsed in
 * the viewer's own timezone and the countdown would read differently in
 * Waterloo than in Vancouver.
 *
 * TODO: confirm the exact date and start time with the CxC team. Taken from the
 * "February 06-08" line on the landing-page mockup and the W27 Figma file.
 */
export const CXC_START = "2027-02-06T09:00:00-05:00";

export type TimeRemaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
};

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

/**
 * Time left between `now` and `target`, clamped at zero.
 *
 * `now` is a parameter rather than an internal `new Date()` so callers control
 * the clock — the component passes the real one, a test passes a fixed one.
 */
export function getTimeRemaining(target: Date, now: Date): TimeRemaining {
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }

  return {
    days: Math.floor(diff / MS_PER_DAY),
    hours: Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR),
    minutes: Math.floor((diff % MS_PER_HOUR) / MS_PER_MINUTE),
    seconds: Math.floor((diff % MS_PER_MINUTE) / MS_PER_SECOND),
    isComplete: false,
  };
}

/** Two-digit display value, as in the mockup: `3` renders as `03`. */
export function formatUnit(value: number): string {
  return value.toString().padStart(2, "0");
}
