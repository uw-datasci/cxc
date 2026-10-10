"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Furthest the needle leans toward the cursor, either side of its own heading. */
const MAX_LEAN_DEG = 12;
/** Pointer updates are applied at most this often, so the needle drifts rather than tracks. */
const UPDATE_MS = 300;

/**
 * Wraps the compass needle in an extra rotation that leans it a little toward the cursor's
 * side — east of the needle tips it clockwise, west counter-clockwise — then lets it settle
 * with a short damped swing. Skipped on touch devices and with reduced motion.
 */
export function CompassLean({
  origin,
  size,
  children,
}: Readonly<{ origin: { x: number; y: number }; size: number; children: ReactNode }>) {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const group = ref.current;
    const svg = group?.ownerSVGElement;
    if (!group || !svg) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pointer: { x: number; y: number } | null = null;
    let timer = 0;

    const apply = () => {
      timer = 0;
      if (!pointer) return;

      const box = svg.getBoundingClientRect();
      const cx = box.left + (box.width * origin.x) / size;
      const cy = box.top + (box.height * origin.y) / size;
      // Bearing from the needle's pivot, clockwise from north; sin() keeps only the
      // east/west component, so the lean never flips when the cursor crosses south.
      const bearing = Math.atan2(pointer.x - cx, cy - pointer.y);
      group.style.setProperty("--lean", `${(Math.sin(bearing) * MAX_LEAN_DEG).toFixed(1)}deg`);
      pointer = null;
    };

    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (!timer) timer = window.setTimeout(apply, UPDATE_MS);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.clearTimeout(timer);
    };
  }, [origin.x, origin.y, size]);

  return (
    <g
      ref={ref}
      className="transition-transform duration-1400 ease-[cubic-bezier(0.34,1.4,0.64,1)] motion-reduce:transition-none"
      style={{
        transform: "rotate(var(--lean, 0deg))",
        transformOrigin: `${origin.x}px ${origin.y}px`,
      }}
    >
      {children}
    </g>
  );
}
