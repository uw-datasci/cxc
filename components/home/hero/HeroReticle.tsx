import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

const hairline = "fill-none [vector-effect:non-scaling-stroke]";

const MARKERS = [
  [-190, -137],
  [-139, -72],
  [-90, -125],
  [-139, 15],
  [-258, 15],
] as const;

type HeroReticleProps = {
  className?: string;
  style?: CSSProperties;
  showMarkers?: boolean;
};

export function HeroReticle({ className, style, showMarkers = true }: HeroReticleProps) {
  return (
    <svg
      aria-hidden
      viewBox="-270 -220 540 440"
      style={style}
      className={cn("overflow-visible", className)}
    >
      <g className="stroke-foreground">
        <circle r={187} className={hairline} />
        <circle r={115} className={hairline} />
      </g>
      <g className="stroke-white">
        <circle r={130} className={hairline} />
      </g>
      <g className="stroke-primary">
        <circle r={160} className={hairline} />
        <circle r={28} className={hairline} />
      </g>
      <g className="stroke-border">
        <circle r={173} className={hairline} />
        <circle r={45} className={hairline} />
      </g>

      {showMarkers && (
        <>
          <path d="M-231 19H-151M-135 35V142" className={cn(hairline, "stroke-foreground")} />
          {MARKERS.map(([x, y]) => (
            <rect
              key={`${x},${y}`}
              x={x}
              y={y}
              width={8}
              height={8}
              className={cn(hairline, "stroke-primary stroke-2")}
            />
          ))}
          <path
            d="M-86 -133V-500"
            className={cn(hairline, "stroke-foreground max-lg:hidden")}
          />
        </>
      )}
    </svg>
  );
}
