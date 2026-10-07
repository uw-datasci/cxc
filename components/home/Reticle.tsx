import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type Tone = "border" | "dark-grey" | "card" | "foreground";

type Ring = { cx: number; cy: number; r: number; tone: Tone };

type ReticleGeometry = {
  size: number;
  /** Shared centre of the inner rings — the point the animations pivot on. */
  center: { x: number; y: number };
  rings: Ring[];
};

const toneClass: Record<Tone, string> = {
  border: "stroke-border",
  "dark-grey": "stroke-dark-grey",
  card: "stroke-card",
  foreground: "stroke-foreground",
};

// Ring geometry copied from the Figma "right circles" groups (1169:27131, 1169:27074).
const geometry = {
  scope: {
    size: 514,
    center: { x: 255.992, y: 262.039 },
    rings: [
      { cx: 257, cy: 257, r: 256.271, tone: "border" },
      { cx: 259.016, cy: 259.016, r: 222.004, tone: "dark-grey" },
      { cx: 254.984, cy: 263.047, r: 155.486, tone: "border" },
      { cx: 254.984, cy: 263.047, r: 171.612, tone: "card" },
      { cx: 255.992, cy: 262.039, r: 37.5686, tone: "dark-grey" },
      { cx: 255.992, cy: 262.039, r: 59.7412, tone: "border" },
      { cx: 255.992, cy: 262.039, r: 239.137, tone: "foreground" },
    ],
  },
  target: {
    size: 372,
    center: { x: 185.271, y: 189.647 },
    rings: [
      { cx: 186, cy: 186, r: 185.271, tone: "border" },
      { cx: 187.459, cy: 187.459, r: 160.471, tone: "dark-grey" },
      { cx: 184.541, cy: 190.376, r: 112.329, tone: "border" },
      { cx: 184.541, cy: 190.376, r: 124, tone: "card" },
      { cx: 185.271, cy: 189.647, r: 26.9882, tone: "dark-grey" },
      { cx: 185.271, cy: 189.647, r: 43.0353, tone: "border" },
      { cx: 185.271, cy: 189.647, r: 172.871, tone: "foreground" },
    ],
  },
} satisfies Record<string, ReticleGeometry>;

export type ReticleVariant = keyof typeof geometry;

const STROKE = 1.45882;

/** Where the `target` reticle's lock brackets should centre, as % of its box. */
export const targetCenter = {
  x: (geometry.target.center.x / geometry.target.size) * 100,
  y: (geometry.target.center.y / geometry.target.size) * 100,
};

/**
 * Concentric-circle reticle from the Figma landing page.
 * - `scope`: a slowly rotating tick bezel and a radar sweep arm.
 * - `target`: a sonar ping; drift and lock-on live in `TargetLock`.
 */
export function Reticle({
  variant,
  className,
}: Readonly<{ variant: ReticleVariant; className?: string }>) {
  const { size, center, rings } = geometry[variant];
  const pivot: CSSProperties = { transformOrigin: `${center.x}px ${center.y}px` };

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={cn(
        "block size-full overflow-visible",
        variant === "scope" ? "opacity-30" : "opacity-42",
        className
      )}
    >
      {rings.map((ring) => (
        <circle
          key={`${ring.r}`}
          cx={ring.cx}
          cy={ring.cy}
          r={ring.r}
          strokeWidth={STROKE}
          className={toneClass[ring.tone]}
        />
      ))}

      {variant === "scope" && (
        <>
          {/* Tick bezel: a minor tick every 6°, a major tick every 30°. */}
          <g className="animate-reticle-spin motion-reduce:animate-none" style={pivot}>
            <circle
              cx={center.x}
              cy={center.y}
              r={196}
              pathLength={360}
              strokeWidth={6}
              strokeDasharray="0.6 5.4"
              className="stroke-foreground"
            />
            <circle
              cx={center.x}
              cy={center.y}
              r={196}
              pathLength={360}
              strokeWidth={14}
              strokeDasharray="0.8 29.2"
              className="stroke-foreground"
            />
          </g>
          <line
            x1={center.x}
            y1={center.y}
            x2={center.x}
            y2={center.y - 239.137}
            strokeWidth={STROKE}
            className="animate-sweep stroke-foreground motion-reduce:animate-none"
            style={pivot}
          />
        </>
      )}

      {variant === "target" && (
        <circle
          cx={center.x}
          cy={center.y}
          r={172.871}
          strokeWidth={STROKE * 1.5}
          className="animate-ping-ring stroke-foreground motion-reduce:hidden"
          style={pivot}
        />
      )}
    </svg>
  );
}
