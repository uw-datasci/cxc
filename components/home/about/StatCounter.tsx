"use client";

import { useCountUp } from "@/lib/hooks/useCountUp";

interface StatCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
}

export function StatCounter({ value, prefix = "", suffix = "" }: StatCounterProps) {
  const { ref, value: current } = useCountUp({ target: value });

  return (
    <span ref={ref}>
      {prefix}
      {current.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
