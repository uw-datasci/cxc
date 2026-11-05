"use client";

import { useLayoutEffect, useRef } from "react";
export function PixelReveal({
  open,
  closeEffect = true,
  cell = 16,
  duration = 400,
}: {
  open: boolean;
  closeEffect?: boolean;
  cell?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    canvas.style.display = "";

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (!open && !closeEffect) // closing via link: let the sheet's own slide-out run
    ) {
      canvas.style.display = "none";
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = getComputedStyle(canvas).color;

    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);

    const times = new Float32Array(cols * rows);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        times[y * cols + x] = Math.random() * 0.7 + ((x / cols + y / rows) / 2) * 0.3;
      }
    }

    const draw = (p: number) => {
      ctx.clearRect(0, 0, w, h);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const t = times[y * cols + x];
          const covered = open ? t > p : t <= p;
          if (covered) ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      }
    };

    draw(0);

    let raf = 0;
    const start = performance.now();

    const frame = (now: number) => {
      const p = (now - start) / duration;
      if (p >= 1) {
        draw(1);
        if (open) canvas.style.display = "none";
        return;
      }
      draw(p);
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [open, closeEffect, cell, duration]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-50 size-full text-background"
    />
  );
}
