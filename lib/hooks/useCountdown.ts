"use client";

import { useEffect, useState } from "react";

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Time left until `target`, an ISO string with an explicit UTC offset.
 *
 * Returns `null` until the first client tick so the server and client markup match.
 */
export function useCountdown(target: string): TimeRemaining | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const targetTime = new Date(target).getTime();

    const tick = () => {
      const current = Date.now();
      setNow(current);
      // Stop ticking once the target has passed, rather than re-rendering zeroes forever.
      if (current >= targetTime) clearInterval(interval);
    };

    // The first tick is deferred rather than run inline, so the effect body does not
    // set state and commit a second render before the browser paints.
    const immediate = setTimeout(tick, 0);
    const interval = setInterval(tick, SECOND);

    return () => {
      clearTimeout(immediate);
      clearInterval(interval);
    };
  }, [target]);

  if (now === null) return null;

  const diff = new Date(target).getTime() - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }

  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
    isComplete: false,
  };
}
