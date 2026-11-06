import Image from "next/image";
import Link from "next/link";
import { PlayIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroGrid } from "./HeroGrid";
import { HeroReticle } from "./HeroReticle";
import {
  vars,
  MAIN_RETICLE,
  place,
  LANE_VARS,
  BLOCKS,
  groupVars,
  inGroup,
  CORNER_RETICLE,
} from "lib/constants/hero";
import { MetaLine, HeroRule } from "./HeroDecor";

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
        <MetaLine>Student-run AI hackathon</MetaLine>
        <MetaLine>
          <time dateTime="2027-02-05/2027-02-07">February 05-07</time>
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
              src="/home/hero-terrain.svg"
              width={1200}
              height={900}
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
          src="/home/cxc-logo.svg"
          width={555}
          height={162}
          alt="CxC"
          priority
          unoptimized
          className="h-auto w-full max-w-xl brightness-0 lg:max-w-none"
        />
      </div>
    </section>
  );
}
