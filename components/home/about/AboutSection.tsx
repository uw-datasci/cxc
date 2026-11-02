import Image from "next/image";
import type { CSSProperties } from "react";
import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

import { SectionBar } from "@/components/ui/section-bar";
import { cn } from "@/lib/utils";

import { StatCounter } from "./StatCounter";

interface AccentHeadingProps {
  children: React.ReactNode;
  className?: string;
}

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

// Figma MAIN frame coordinates: the About section runs y=2112 to y=3736 at 1280 wide.
const STAGE_W = 1280;
const STAGE_TOP = 2112;
const STAGE_H = 1624;

function place(x: number, y: number, w: number, h?: number): CSSProperties {
  return {
    left: `${(x / STAGE_W) * 100}%`,
    top: `${((y - STAGE_TOP) / STAGE_H) * 100}%`,
    width: `${(w / STAGE_W) * 100}%`,
    ...(h === undefined ? {} : { height: `${(h / STAGE_H) * 100}%` }),
  };
}

const STATS: Stat[] = [
  { value: 300, suffix: "+", label: "Participants" },
  { value: 20000, prefix: "$", label: "In prizes" },
  { value: 10, suffix: "+", label: "Collaborating companies" },
];

export function AboutSection() {
  return (
    <section id="about" className="relative scroll-mt-8 overflow-hidden py-10">
      <div className="relative">
        <GridBackdrop />
        <HudMarkers />

        <SectionBar number="01" title="About us" className="relative" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-16 sm:px-10">
        <div className="ml-auto max-w-2xl text-right">
          <AccentHeading className="flex-row-reverse">A fresh new start</AccentHeading>
          <p className="mt-6 ml-auto max-w-[534px] font-mono text-base leading-snug sm:text-lg md:text-xl">
            Since last year&rsquo;s iteration of CxC, we&rsquo;ve decided to switch things up
            and pivot to a full in-person weekend experience. Hackers who are familiar with
            past CxCs can enjoy a change of pace with an eventful weekend of in-person
            connections, workshops, sponsor networking events, and activities!
          </p>
        </div>
      </div>

      <figure className="relative mt-4">
        <div className="relative w-[106.64%] -translate-x-[2.66%]">
          <Image
            src="/home/about-terrain.svg"
            alt=""
            width={1365}
            height={467}
            className="w-full select-none"
            draggable={false}
            priority
          />
        </div>

        <div
          className="relative -mt-2 pt-10 pb-16"
          style={{
            background:
              "linear-gradient(180deg, #1C1B1B 50.28%, rgba(29,28,28,0.77) 67.31%, rgba(31,30,31,0.43) 84.13%, rgba(0,0,0,0) 100%)",
          }}
        >
          <dl className="mx-auto grid w-full max-w-7xl grid-cols-3 gap-6 px-16 text-background">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-4 text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="flex flex-col items-center gap-4">
                  <span className="text-4xl leading-none font-bold sm:text-6xl md:text-8xl">
                    <StatCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </span>
                  <span aria-hidden className="text-base leading-tight sm:text-xl md:text-2xl">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </figure>
      </div>

      <div className="@container relative aspect-1280/1624 w-full overflow-hidden">
        <GridBackdrop style={place(-2, 2112, 1079, 628)} />

        {/* Frame 200: Figma's 180deg rotation plus a vertical flip is a horizontal mirror. */}
        <TerrainPiece
          src="/home/about-terrain.svg"
          width={1365}
          height={467}
          className="-scale-x-100"
          style={place(350, 2331, 1365, 467)}
        />

        <GridBackdrop style={place(294, 3033, 1079, 703)} />

        <div className="absolute" style={place(100, 2193, 480)}>
          <AccentHeading className="text-[clamp(1rem,2.81cqw,2.25rem)]">About CxC</AccentHeading>
        </div>

        <p
          className="absolute font-mono text-[clamp(0.6875rem,1.72cqw,1.375rem)] leading-snug"
          style={place(100, 2277, 534)}
        >
          Join us for the 6th year of Waterloo&rsquo;s largest student-run AI hackathon! We
          are a beginner-friendly AI hackathon that brings together students and companies to
          build projects that solve real-world problems. Join us again this year for a
          weekend of hacking and fun!
        </p>

        <div className="absolute" style={place(694, 3360, 480)}>
          <AccentHeading className="flex-row-reverse justify-start text-[clamp(1rem,2.81cqw,2.25rem)]">
            You belong here
          </AccentHeading>
        </div>

        <p
          className="absolute text-right font-mono text-[clamp(0.6875rem,1.72cqw,1.375rem)] leading-snug"
          style={place(591, 3444, 585)}
        >
          Meet a community of like-minded hackers, network with our company sponsors and
          judges, and build the project you&rsquo;ve always been dreaming of. With AI at the
          forefront of the world recently, CxC is the perfect place for veterans and
          fledgling hackers to get started!
        </p>

        {/* Group 96: Figma reports it by its rotated bbox, so it is placed from that centre. */}
        <TerrainPiece
          src="/home/about-terrain-lower-b.svg"
          width={921}
          height={550}
          className="-rotate-[9.25deg]"
          style={place(-108.83, 2739.48, 921.46, 549.84)}
        />

        <PhotoPlaceholder style={place(108, 3356, 392, 299.78)} />
        <PhotoPlaceholder style={place(800, 2207, 392, 299.78)} />
        <PhotoPlaceholder style={place(109, 2701.7, 395, 302.07)} />
        <PhotoPlaceholder style={place(429, 2847, 317.46, 242.78)} />

        <Chevrons style={place(779, 2851, 424, 59.81)} />
      </div>

    </section>
  );
}

interface DecorProps {
  className?: string;
  style?: CSSProperties;
}

function GridBackdrop({ className, style }: DecorProps) {
  return (
    <div
      aria-hidden
      style={style}
      className={cn(
        "pointer-events-none absolute bg-[url('/home/about-grid.svg')] bg-[length:86.93px_86.93px] bg-repeat",
        !className && !style && "top-0 left-[4.5%] h-[83%] w-[88.8%]",
        className
      )}
    />
  );
}

// Figma `Group 56`, as fractions of the 1280 x 1121 block above the stats band.
function HudMarkers() {
  const squares = [
    { left: "29%", top: "11.7%" },
    { left: "41.9%", top: "40.3%" },
    { left: "8.3%", top: "32.4%" },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {squares.map((pos) => (
        <span
          key={`${pos.left}-${pos.top}`}
          style={pos}
          className="absolute size-[0.7%] min-h-2 min-w-2 border-2 border-primary"
        />
      ))}
      <span
        style={{ left: "7.97%", top: "13.6%", height: "16.2%" }}
        className="absolute w-px bg-foreground"
      />
      <span
        style={{ left: "12.8%", top: "32.9%", width: "4%" }}
        className="absolute h-px bg-foreground"
      />
      <span
        style={{ left: "53.5%", top: "40.7%", width: "11%" }}
        className="absolute h-px bg-foreground"
      />
    </div>
  );
}

function AccentHeading({ children, className }: AccentHeadingProps) {
  return (
    <h2 className={cn("text-header-main flex items-center gap-5", className)}>
      <CaretRightIcon aria-hidden weight="fill" className="h-4 w-2 shrink-0 text-primary" />
      <span className="font-bold text-primary uppercase">{children}</span>
    </h2>
  );
}

interface TerrainPieceProps extends DecorProps {
  src: string;
  width: number;
  height: number;
}

function TerrainPiece({ src, width, height, className, style }: TerrainPieceProps) {
  return (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      draggable={false}
      style={style}
      className={cn("absolute max-w-none select-none", className)}
    />
  );
}

// Figma `Frame 148`: 424 x 59.81, three chevrons 140.89 wide at 141.55 pitch.
function Chevrons({ className, style }: DecorProps) {
  const SHADES = ["text-dark-blue", "text-primary", "text-primary/55"];

  return (
    <svg
      aria-hidden
      viewBox="0 0 424 59.81"
      style={style}
      className={cn("absolute", className)}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      {SHADES.map((shade, i) => (
        <path
          key={shade}
          transform={`translate(${i * 141.55} 0)`}
          d="M140.89 0 70.45 29.9l70.44 29.91H70.45L0 29.9 70.45 0z"
          className={shade}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

// TODO: replace with event photography once supplied.
function PhotoPlaceholder({ className, style }: DecorProps) {
  return (
    <div
      aria-hidden
      style={style}
      className={cn("absolute border-2 border-border bg-muted", className)}
    />
  );
}
