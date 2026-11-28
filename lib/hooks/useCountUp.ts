"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  target: number;
  durationMs?: number;
}

export function useCountUp({ target, durationMs = 1600 }: UseCountUpOptions) {
  const ref = useRef<HTMLSpanElement>(null);
  // Starts at the real figure so the server renders it and it survives no JS.
  const [value, setValue] = useState(target);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let start: number | null = null;

    const step = (now: number) => {
      start ??= now;
      const progress = Math.min((now - start) / durationMs, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setValue(0);
          return;
        }
        if (entry.intersectionRatio < 0.4) return;
        observer.disconnect();
        frame = requestAnimationFrame(step);
      },
      { threshold: [0, 0.4] }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, durationMs]);

  return { ref, value };
}
