import Image from "next/image";

import { SectionBar } from "@/components/ui/section-bar";
import { cn } from "@/lib/utils";

import { ProjectsCarousel } from "./ProjectsCarousel";

export function ProjectsSection() {
  return (
    <section id="projects" className="relative scroll-mt-8 overflow-hidden py-10">
      <SectionBar number="02" title="Projects" className="relative" />

      <div className="relative mx-auto mt-8 aspect-1280/1490 w-full max-w-7xl">
        <Image
          src="/home/projects-radar.svg"
          alt=""
          width={464}
          height={520}
          draggable={false}
          className="absolute top-[13.15%] right-[calc((100%-100vw)/2)] z-0 w-[36.25%] max-w-none select-none"
        />

        <Image
          src="/home/projects-terrain.svg"
          alt=""
          width={543}
          height={1344}
          draggable={false}
          className="absolute top-[6.58%] right-[calc((100%-100vw)/2)] z-1 w-[42.42%] max-w-none select-none"
        />

        <HudMarkers />

        <Stripes className="absolute top-[5.1%] left-[50.47%] z-20 w-[40.62%]" />
        <Stripes className="absolute top-[89.4%] left-[7.81%] z-20 w-[40.62%]" />

        <ProjectsCarousel className="absolute inset-0 z-30" />
      </div>
    </section>
  );
}

function HudMarkers() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 hidden sm:block">
      <span className="absolute top-[27.65%] left-[55.78%] size-2.25 border-2 border-primary" />
      <span className="absolute top-[27.65%] left-[67.34%] size-2.25 border-2 border-primary" />
      <span className="absolute top-[16.58%] left-[80.86%] size-2.25 border-2 border-primary" />
      <span className="absolute top-[17.38%] left-[63.28%] size-2.25 border-2 border-primary" />
      <span className="absolute top-[94.3%] left-[49.38%] size-2.25 border-2 border-primary" />
      <span className="absolute top-[27.99%] left-[57.89%] h-px w-[6.64%] bg-foreground" />
      <span className="absolute top-[94.56%] left-[32.89%] h-px w-[14.22%] bg-foreground" />
      <span className="absolute top-[90.4%] left-[49.84%] h-[3.42%] w-px bg-foreground" />
      <span className="absolute top-[6.58%] left-[81.17%] h-[9.46%] w-px bg-foreground" />
    </div>
  );
}

function Stripes({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 520 52"
      className={cn("h-auto text-dark-grey", className)}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d="M26 0h26L26 52H0z"
          transform={`translate(${i * 65} 0)`}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
