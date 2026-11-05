import type { CSSProperties } from "react";

export type Rect = { x: number; y: number; h: number; w?: number };
export type Frame = { x: number; y: number; w: number; h: number };

export const STAGE: Frame = { x: 0, y: 0, w: 1452, h: 870 };
export const MOBILE_FRAME: Frame = { x: 335, y: 20, w: 1117, h: 800 };

export const TERRAIN_RECT = { x: 589, y: 0, h: 775 };

export const BLOCKS: Required<Rect>[] = [
  { x: 675, y: 25, w: 268, h: 261 },
  { x: 850, y: 115, w: 434, h: 550 },
];

function reticleRect(cx: number, cy: number, outerR: number): Required<Rect> {
  const u = outerR / 187;
  return { x: cx - 270 * u, y: cy - 220 * u, w: 540 * u, h: 440 * u };
}

export const MAIN_RETICLE = reticleRect(700, 250, 217);
export const CORNER_RETICLE = reticleRect(1310, 575, 138);

const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

const cqw = (n: number, frameW: number) => `calc(100cqw * ${(n / frameW).toFixed(5)})`;

/** Positions a rect against the stage (`--l/--t/--w/--h`) and mobile frame (`--ml/--mt/--mw/--mh`). */
export function vars(r: Required<Rect>): CSSProperties {
  const out: Record<string, string> = {};

  for (const [p, f] of [
    ["", STAGE],
    ["m", MOBILE_FRAME],
  ] as const) {
    out[`--${p}l`] = pct((r.x - f.x) / f.w);
    out[`--${p}t`] = pct((r.y - f.y) / f.h);
    out[`--${p}w`] = pct(r.w / f.w);
    out[`--${p}h`] = pct(r.h / f.h);
  }

  return out as CSSProperties;
}

/** Positions a rect relative to the terrain lane (children of the lane use `inGroup`). */
export function groupVars(r: Required<Rect>): CSSProperties {
  const dx = r.x - TERRAIN_RECT.x;

  return {
    "--t": pct((r.y - TERRAIN_RECT.y) / TERRAIN_RECT.h),
    "--h": pct(r.h / TERRAIN_RECT.h),
    "--x": cqw(dx, STAGE.w),
    "--w": cqw(r.w, STAGE.w),
    "--mx": cqw(dx, MOBILE_FRAME.w),
    "--mw": cqw(r.w, MOBILE_FRAME.w),
  } as CSSProperties;
}

/** Variables for the terrain lane container itself. */
export const LANE_VARS = (() => {
  const t = TERRAIN_RECT;

  return {
    "--st": pct((t.y - STAGE.y) / STAGE.h),
    "--sh": pct(t.h / STAGE.h),
    "--sl": pct((t.x - STAGE.x) / STAGE.w),
    "--mst": pct((t.y - MOBILE_FRAME.y) / MOBILE_FRAME.h),
    "--msh": pct(t.h / MOBILE_FRAME.h),
    "--msl": pct((t.x - MOBILE_FRAME.x) / MOBILE_FRAME.w),
  } as CSSProperties;
})();

/** Pair with `vars()`. */
export const place = "absolute top-(--mt) left-(--ml) lg:top-(--t) lg:left-(--l)";

/** Pair with `groupVars()`. */
export const inGroup = "absolute top-(--t) left-(--mx) lg:left-(--x)";
