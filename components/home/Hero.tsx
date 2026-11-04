import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroReticle } from "./HeroReticle";
import { HeroGrid } from "./HeroGrid";

const LOGO = { src: "/home/cxc-logo.svg", width: 555, height: 162 };
const TERRAIN = { src: "/home/hero-terrain.svg", width: 1200, height: 900 };

const EVENT = {
  tagline: "Student-run AI hackathon",
  dates: "February 05-07",
  datetime: "2027-02-05/2027-02-07",
};

type Rect = { x: number; y: number; h: number; w?: number };
type Frame = { x: number; y: number; w: number; h: number };

const STAGE: Frame = { x: 0, y: 0, w: 1452, h: 870 };
const MOBILE_FRAME: Frame = { x: 335, y: 20, w: 1117, h: 800 };

const TERRAIN_RECT = { x: 589, y: 0, h: 775 };

const BLOCKS: Required<Rect>[] = [
  { x: 675, y: 25, w: 268, h: 261 },
  { x: 850, y: 120, w: 434, h: 550 },
];

function reticleRect(cx: number, cy: number, outerR: number): Required<Rect> {
  const u = outerR / 187;
  return { x: cx - 270 * u, y: cy - 220 * u, w: 540 * u, h: 440 * u };
}

const MAIN_RETICLE = reticleRect(700, 250, 217);
const CORNER_RETICLE = reticleRect(1310, 575, 138);

const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

const cqw = (n: number, frameW: number) => `calc(100cqw * ${(n / frameW).toFixed(5)})`;

function vars(r: Required<Rect>): CSSProperties {
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

function groupVars(r: Required<Rect>): CSSProperties {
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

const LANE_VARS = (() => {
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

const place = "absolute top-(--mt) left-(--ml) lg:top-(--t) lg:left-(--l)";

const inGroup = "absolute top-(--t) left-(--mx) lg:left-(--x)";

function Marker({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("size-3 shrink-0 border-2 border-primary", className)} />
  );
}

function MetaLine({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 font-mono text-sm tracking-widest uppercase">
      <Marker />
      {children}
    </li>
  );
}

function HeroRule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-3", className)}>
      <Marker />
      <span className="h-px flex-1 bg-foreground" />
      <Marker />
      <Marker className="-ml-1" />
    </div>
  );
}

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="@container relative isolate flex flex-col gap-6 overflow-hidden bg-background pt-6 pb-8 lg:block lg:aspect-1452/870 lg:p-0"
    >
      {/* Background grid */}
      <HeroGrid
        cols={12}
        rows={7}
        className="absolute right-[3.6%] -z-10 hidden w-[86%] lg:bottom-1/6 lg:block"
      />
      <HeroGrid
        cols={12}
        rows={7}
        className="absolute right-[4.6%] bottom-[40%] -z-10 lg:right-[3.6%] lg:bottom-1/6 lg:hidden"
      />
      {/* Meta */}
      <ul className="flex flex-col gap-1 px-4 lg:absolute lg:top-[3.5%] lg:left-[1.2%] lg:z-10 lg:px-0">
        <MetaLine>{EVENT.tagline}</MetaLine>
        <MetaLine>
          <time dateTime={EVENT.datetime}>{EVENT.dates}</time>
        </MetaLine>
      </ul>
      {/* Vertical hairline under the meta markers */}
      <span
        aria-hidden
        className="absolute top-[11%] left-[calc(1.2%+5.5px)] hidden h-[24.5%] w-px bg-foreground lg:block"
      />

      {/* Visual */}
      <div
        aria-hidden
        className="relative aspect-1117/800 lg:absolute lg:inset-0 lg:aspect-auto"
      >
        {/* Main reticle */}
        <HeroReticle
          style={vars(MAIN_RETICLE)}
          className={cn(place, "z-10 w-(--mw) lg:w-(--w)")}
        />

        {/* Terrain group */}
        <div
          style={LANE_VARS}
          className="absolute top-(--mst) right-0 left-(--msl) flex h-(--msh) justify-end-safe lg:top-(--st) lg:left-(--sl) lg:h-(--sh)"
        >
          <div className="relative h-full shrink-0">
            {/* Blue rectangles */}
            {BLOCKS.map((b) => (
              <div
                key={`${b.x},${b.y}`}
                style={groupVars(b)}
                className={cn(inGroup, "z-0 h-(--h) w-(--mw) bg-primary lg:w-(--w)")}
              />
            ))}

            {/* Corner reticle */}
            <HeroReticle
              showMarkers={false}
              style={groupVars(CORNER_RETICLE)}
              className={cn(inGroup, "z-10 w-(--mw) lg:w-(--w)")}
            />

            <Image
              src={TERRAIN.src}
              width={TERRAIN.width}
              height={TERRAIN.height}
              alt=""
              priority
              unoptimized
              className="relative z-20 block h-full w-auto max-w-none"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col px-4 lg:absolute lg:bottom-1/6 lg:left-[1.2%] lg:z-10 lg:w-[44%] lg:px-0">
        <HeroRule className="mb-8 ml-50 hidden w-[47%] lg:flex" />

        <div className="mb-6 flex items-center gap-3 lg:mb-8">
          <PlayIcon aria-hidden weight="fill" className="size-4 text-primary" />
          <Button asChild size="lg" className="px-10 py-6 text-lg font-normal uppercase">
            <Link href="/sign-up">Register now</Link>
          </Button>
        </div>

        <Image
          src={LOGO.src}
          width={LOGO.width}
          height={LOGO.height}
          alt="CxC"
          priority
          unoptimized
          className="h-auto w-full max-w-xl brightness-0 lg:max-w-none"
        />
      </div>
    </section>
  );
}
