"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Project {
  title: string;
  blurb: string;
  team: string[];
  /** The project's Devpost page. */
  url: string;
  /** Screenshot from that page's gallery. */
  image: string;
  summary: string;
}

interface Slot {
  x: number;
  y: number;
  scale: number;
  z: string;
  opacity: number;
}

const PROJECTS: Project[] = [
  {
    title: "CORTEX",
    blurb: "A 3D memory layer, so an AI chat never starts from scratch.",
    team: ["Vibhor Sharma", "Divyam Banga", "Tanay Jagadeesh"],
    url: "https://devpost.com/software/cortex-wtmu3s",
    image: "/home/projects/cortex.jpg",
    summary:
      "Cortex turns past conversations into memory a model can reuse. Hybrid search mixes " +
      "exact matches with meaning-based recall, so it finds both the facts and the related " +
      "ideas, and a Model Context Protocol server feeds what it finds straight into the next " +
      "chat. Every conversation sits in a 3D graph that lights up where a memory lives.",
  },
  {
    title: "Prec0gnition",
    blurb: "Weight prediction-market traders by how often they were right.",
    team: ["Matthew Li", "Thomson Lam", "Henrique Leite", "Luke Blommesteyn"],
    url: "https://devpost.com/software/precognition",
    image: "/home/projects/precognition.jpg",
    summary:
      "Precognition reads trade-level wallet flow from Polymarket and profiles how accurate " +
      "each wallet has been, then infers what the calibrated ones currently believe. It " +
      "reports a single manipulation-aware probability beside the market price, with how " +
      "many trusted wallets drive the signal, how split they are, and an integrity risk flag.",
  },
  {
    title: "Darwin",
    blurb: "Websites used to be static. Now they undergo natural selection.",
    team: ["Jaden Noronha", "Bosco Zhang", "Lawrence Zou"],
    url: "https://devpost.com/software/darwin-anoy9k",
    image: "/home/projects/darwin.jpg",
    summary:
      "Darwin turns a flat web layout into a 3D data visualization. Gemini agents act as " +
      "designers generating A/B variants and as synthetic users browsing them, while a " +
      "PyTorch model predicts the click-through rate of any element from its CSS and its " +
      "position \u2014 months of traffic simulated in seconds, before production code changes.",
  },
  {
    title: "Cough2Care",
    blurb: "From sound to solution.",
    team: ["Nicholas Jiang", "Noah Bradwin", "Shreeya C", "Prisha Patel"],
    url: "https://devpost.com/software/cough2care",
    image: "/home/projects/cough2care.jpg",
    summary:
      "Cough2Care makes any microphone a preliminary respiratory screening tool. A model " +
      "trained on cough recordings reads the acoustic pattern to assess risk and flags who " +
      "may need medical attention, so health workers without diagnostic equipment can " +
      "prioritise cases before a condition worsens.",
  },
  {
    title: "TruthTone++",
    blurb: "Uncover the invisible.",
    team: ["S T", "Aryan V", "Jerry Wu"],
    url: "https://devpost.com/software/truth-tone-js46ea",
    image: "/home/projects/truthtone.jpg",
    summary:
      "TruthTone++ detects deepfaked audio and shows its working. A clip is analysed for the " +
      "patterns an ear misses, then drawn as a 3D fingerprint \u2014 real voices come out " +
      "organic and chaotic, synthetic ones oddly geometric \u2014 with a timeline heatmap " +
      "marking the suspicious moments.",
  },
];

const SLOTS: Record<number, Slot> = {
  [-2]: { x: 0.107, y: 0.1188, scale: 0.518, z: "z-10", opacity: 0.3 },
  [-1]: { x: 0.2, y: 0.2369, scale: 0.669, z: "z-20", opacity: 0.55 },
  [0]: { x: 0.3281, y: 0.4174, scale: 1, z: "z-40", opacity: 1 },
  [1]: { x: 0.2195, y: 0.6168, scale: 0.669, z: "z-20", opacity: 0.55 },
  [2]: { x: 0.1445, y: 0.7443, scale: 0.669, z: "z-10", opacity: 0.3 },
};

const CARD_W = 0.5005;
const CARD_H = (((CARD_W * 1280 - 2) * 390) / 640 + 2) / 1490;

const transformFor = (slot: Slot) => {
  const tx = (slot.x / CARD_W) * 100 - 50;
  const ty = (slot.y / CARD_H) * 100 - 50;
  return `translate(${tx.toFixed(3)}%, ${ty.toFixed(3)}%) scale(${slot.scale})`;
};

const ADVANCE_MS = 4000;

/**
 * A wheel gesture is over once no event has arrived for this long.
 */
const WHEEL_QUIET_MS = 140;

/** How long after the pointer leaves before the carousel drives itself again. */
const RESUME_MS = 3000;

const TURN_MS = 700;

/**
 * Spacing between the turns a click takes to walk its card into focus.
 */
const STEP_MS = TURN_MS;

/** Lets the last turn land before the dialog covers the card. */
const OPEN_MS = TURN_MS;

/**
 * The arc's bounding box, as a fraction of the stage. A wheel is judged against the box
 * rather than against whatever card is under the cursor, since a card sliding out from
 * under a still pointer must not hand the gesture back to the page half way through.
 * Holding the arc is left to the cards themselves — the box is mostly empty space, and
 * a cursor resting in it used to stop the arc turning at all.
 */
const ZONE = { right: 0.58, top: 0.04, bottom: 0.84 };

/** Signed distance from the focused card, so the arc wraps round. */
const offsetOf = (index: number, active: number) =>
  ((index - active + PROJECTS.length + 2) % PROJECTS.length) - 2;

export function ProjectsCarousel({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);
  const [paused, setPaused] = useState(false);
  // Which way the arc last turned. The wrapping slot differs by direction, and only
  // that one jump is untransitioned.
  const [forward, setForward] = useState(true);
  // The card a click is walking into focus, if any. It is opened on arrival.
  const [pending, setPending] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heldRef = useRef(false);

  // Read by the timer, which outlives any one render.
  useEffect(() => {
    heldRef.current = paused || open !== null || pending !== null;
  }, [paused, open, pending]);

  /**
   * Starts the cadence from this moment. Every turn restarts it, whoever caused it, so
   * a turn of the viewer's own is never followed a moment later by an automatic one.
   */
  const restart = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      // A tick that lands while the arc is held is skipped rather than rescheduled:
      // rebuilding the timer around every hold left the gap between turns anywhere
      // between a moment and a full ADVANCE_MS.
      if (heldRef.current) return;
      setForward(true);
      setActive((i) => (i + 1) % PROJECTS.length);
    }, ADVANCE_MS);
  };

  const step = (delta: number) => {
    setForward(delta > 0);
    setActive((i) => (i + delta + PROJECTS.length) % PROJECTS.length);
    restart();
  };

  const hold = () => {
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = null;
    setPaused(true);
  };

  const release = () => {
    if (resumeRef.current) clearTimeout(resumeRef.current);
    // Turns once on resuming, then leaves the interval to it. Without that first turn
    // the wait is RESUME_MS plus a whole fresh ADVANCE_MS before anything moves.
    resumeRef.current = setTimeout(() => {
      setPaused(false);
      step(1);
    }, RESUME_MS);
  };

  // Turns toward a card now and leaves the rest of the walk to the effect below. The
  // first turn has to happen on the click itself, or the arc sits still for a beat.
  const walkTo = (index: number) => {
    const offset = offsetOf(index, active);
    if (offset === 0) {
      setOpen(PROJECTS[index]);
      return;
    }

    step(Math.sign(offset));
    setPending(index);
  };

  const inZone = (point: { clientX: number; clientY: number }) => {
    const node = trackRef.current;
    if (!node) return false;

    const rect = node.getBoundingClientRect();
    const x = (point.clientX - rect.left) / rect.width;
    const y = (point.clientY - rect.top) / rect.height;
    return x >= 0 && x <= ZONE.right && y >= ZONE.top && y <= ZONE.bottom;
  };

  useEffect(() => () => void (resumeRef.current && clearTimeout(resumeRef.current)), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    restart();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // A click on a card off the centre turns the arc one slot at a time until that card
  // reaches the focus, then opens it. Setting `active` outright would rotate several
  // slots at once, and only one slot may wrap untransitioned, so the other wrapping
  // card flew the length of the track instead of turning with the rest.
  useEffect(() => {
    if (pending === null) return;

    const offset = offsetOf(pending, active);
    const id = setTimeout(
      () => {
        if (offset === 0) {
          setOpen(PROJECTS[pending]);
          setPending(null);
        } else {
          step(Math.sign(offset));
        }
      },
      offset === 0 ? OPEN_MS : STEP_MS
    );
    return () => clearTimeout(id);
  }, [pending, active]);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    let last = 0;
    let turned = false;
    const onWheel = (event: WheelEvent) => {
      // Only a wheel inside the arc drives it. The stage spans the whole content
      // column, so capturing anywhere in it would swallow ordinary page scrolling.
      if (!inZone(event)) return;
      event.preventDefault();

      // Every event refreshes the gesture, including the ones that turn nothing, so the
      // quiet period is measured from the end of the whole flick.
      const now = event.timeStamp;
      if (now - last > WHEEL_QUIET_MS) turned = false;
      last = now;

      if (turned) return;
      if (Math.abs(event.deltaY) < 2) return;
      turned = true;
      setPending(null);
      // A gesture over the gaps between the cards holds the arc for a moment too. Over
      // a card the pointer itself is already holding it.
      if (!(event.target as Element | null)?.closest("article")) {
        hold();
        release();
      }

      step(event.deltaY > 0 ? 1 : -1);
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
    // `step`, `hold` and `release` only touch refs and state setters, so the listener
    // is bound once rather than rebound on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div ref={trackRef} className={cn("@container relative overflow-hidden", className)}>
        {PROJECTS.map((project, index) => {
          const offset = offsetOf(index, active);
          const slot = SLOTS[offset];
          const isFocused = offset === 0;

          return (
            <article
              key={project.title}
              onPointerEnter={hold}
              onPointerLeave={release}
              style={{
                transform: transformFor(slot),
                opacity: slot.opacity,
                transitionDuration: `${TURN_MS}ms`,
              }}
              className={cn(
                "absolute top-0 left-0 w-[50.05%] origin-center border border-border bg-card",
                "ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
                offset === (forward ? 2 : -2)
                  ? "transition-none"
                  : "transition-[transform,opacity]",
                slot.z
              )}
            >
              {/* A card off the centre turns into focus first, so a click never opens a
                  dialog for a project the viewer cannot properly see. */}
              <button
                type="button"
                onClick={() => walkTo(index)}
                className="block w-full cursor-pointer text-left focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <span className="sr-only">{`Read about ${project.title}`}</span>
                {/* The box keeps the art's ratio: CARD_H above is derived from it. */}
                <div className="relative aspect-640/390 w-full bg-card">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 640px, 50vw"
                    draggable={false}
                    className="object-cover select-none"
                  />
                </div>
              </button>

              <figcaption
                className={cn(
                  "pointer-events-none absolute inset-x-0 bottom-0 bg-dark-grey px-5 py-3 text-background",
                  "transition-opacity duration-500 motion-reduce:transition-none",
                  isFocused ? "opacity-100" : "opacity-0"
                )}
              >
                <p className="font-mono text-[1.25cqw] font-bold uppercase">{project.title}</p>
                <p className="font-mono text-[0.86cqw] uppercase">
                  {project.team.map((member) => `[${member}]`).join(", ")}
                </p>
              </figcaption>
            </article>
          );
        })}
      </div>

      <Dialog open={open !== null} onOpenChange={(next) => !next && setOpen(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase">{open?.title}</DialogTitle>
            <DialogDescription className="font-mono text-xs uppercase">
              {open?.team.map((member) => `[${member}]`).join(", ")}
            </DialogDescription>
          </DialogHeader>

          {open ? (
            <>
              <div className="relative aspect-640/390 w-full border border-border">
                <Image
                  src={open.image}
                  alt={`${open.title} screenshot`}
                  fill
                  sizes="(min-width: 640px) 36rem, 100vw"
                  className="object-cover"
                />
              </div>

              <p className="font-mono text-xs tracking-widest uppercase">{open.blurb}</p>
              <p className="leading-relaxed">{open.summary}</p>

              <a
                href={open.url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs tracking-widest text-primary uppercase underline underline-offset-4 hover:text-dark-blue"
              >
                View on Devpost
              </a>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
