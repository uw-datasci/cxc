import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * Reusable blueprint grid, drawn in code.
 *
 * - Anchored bottom-right
 * - Top and left are open: lines run past the first line by `bleed` cells with
 *   no cap. Set a bleed to 0 to close that side.
 * - Size: either give it a width (`w-*`, height follows), or pass `cell` and it
 *   sizes itself so one cell equals that length.
 * - Colour: strokes use the `border` token; override with e.g. `className="stroke-primary"`.
 *
 * @example
 * <BlueprintGrid cols={12} rows={7} className="absolute right-4 bottom-8 w-3/4" />
 * <BlueprintGrid cols={6} rows={4} cell="3rem" bleed={{ top: 0, left: 0.5 }} />
 */
const CELL = 100; // viewBox units; the rendered size comes from the svg's width

type HeroGridProps = {
  cols?: number;
  rows?: number;
  /** Open overhang past the first line, in cells. 0 closes that side. */
  bleed?: { top?: number; left?: number };
  /** Any CSS length. Sets the width so one cell is this size. */
  cell?: string;
  className?: string;
  style?: CSSProperties;
};

export function HeroGrid({
  cols = 12,
  rows = 7,
  bleed,
  cell,
  className,
  style,
}: HeroGridProps) {
  const left = (bleed?.left ?? 0.29) * CELL;
  const top = (bleed?.top ?? 0.29) * CELL;
  const w = left + cols * CELL;
  const h = top + rows * CELL;

  // from the bottom-right corner, so the last lines are the svg's edges
  const xs = Array.from({ length: cols + 1 }, (_, i) => w - i * CELL);
  const ys = Array.from({ length: rows + 1 }, (_, i) => h - i * CELL);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${w} ${h}`}
      style={cell ? { width: `calc(${cell} * ${w / CELL})`, ...style } : style}
      className={cn("h-auto overflow-visible stroke-border", className)}
    >
      {xs.map((x) => (
        <line
          key={`v${x}`}
          x1={x}
          x2={x}
          y1={0}
          y2={h}
          vectorEffect="non-scaling-stroke"
          shapeRendering="crispEdges"
        />
      ))}
      {ys.map((y) => (
        <line
          key={`h${y}`}
          x1={0}
          x2={w}
          y1={y}
          y2={y}
          vectorEffect="non-scaling-stroke"
          shapeRendering="crispEdges"
        />
      ))}
    </svg>
  );
}
