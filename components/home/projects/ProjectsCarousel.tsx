"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface Project {
  title: string;
  blurb: string;
  team: string[];
}

interface Slot {
  left: string;
  top: string;
  scale: number;
  z: string;
  hidden?: boolean;
}

// TODO: replace with the real roster and screenshots once they are supplied.
const PROJECTS: Project[] = [
  {
    title: "Adaptive Workflow Engine",
    blurb: "Route every task to the model that handles it best.",
    team: ["John Smith", "John Smith", "John Smith"],
  },
  {
    title: "Signal Drift Detector",
    blurb: "Catch distribution shift before it reaches production.",
    team: ["John Smith", "John Smith"],
  },
  {
    title: "Transit Demand Model",
    blurb: "Forecast ridership across the region, stop by stop.",
    team: ["John Smith", "John Smith", "John Smith"],
  },
  {
    title: "Retail Churn Forecast",
    blurb: "Flag the accounts most likely to lapse this quarter.",
    team: ["John Smith", "John Smith"],
  },
  {
    title: "Campus Energy Atlas",
    blurb: "Map consumption building by building, hour by hour.",
    team: ["John Smith", "John Smith", "John Smith"],
  },
  {
    title: "Clinic Wait Time Model",
    blurb: "Predict queue length from intake data alone.",
    team: ["John Smith", "John Smith"],
  },
  {
    title: "Shelf Stock Vision",
    blurb: "Spot empty facings from a single aisle photo.",
    team: ["John Smith", "John Smith", "John Smith"],
  },
];

const SLOTS: Record<number, Slot> = {
  [-3]: { left: "6.0%", top: "5.5%", scale: 0.42, z: "z-0", hidden: true },
  [-2]: { left: "10.7%", top: "11.88%", scale: 0.518, z: "z-10" },
  [-1]: { left: "20.0%", top: "23.69%", scale: 0.669, z: "z-20" },
  [0]: { left: "32.81%", top: "41.74%", scale: 1, z: "z-40" },
  [1]: { left: "21.95%", top: "61.68%", scale: 0.669, z: "z-20" },
  [2]: { left: "14.45%", top: "74.43%", scale: 0.669, z: "z-10" },
  [3]: { left: "10.0%", top: "86.0%", scale: 0.42, z: "z-0", hidden: true },
};

const WINDOW = 3;

const ADVANCE_MS = 4000;

export function ProjectsCarousel({ className }: { className?: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => setActive((i) => (i + 1) % PROJECTS.length), ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={cn("@container relative overflow-hidden", className)}>
      {PROJECTS.map((project, index) => {
        const ahead = (index - active + PROJECTS.length) % PROJECTS.length;
        const offset = ahead <= WINDOW ? ahead : ahead - PROJECTS.length;
        if (offset < -WINDOW) return null;

        const slot = SLOTS[offset];
        const isFocused = offset === 0;

        return (
          <article
            key={project.title}
            aria-hidden={!isFocused}
            style={{
              left: slot.left,
              top: slot.top,
              transform: `translate(-50%, -50%) scale(${slot.scale})`,
            }}
            className={cn(
              "absolute w-[50.05%] origin-center border border-border bg-card",
              "transition-[left,top,transform,opacity] duration-700 ease-out motion-reduce:transition-none",
              slot.hidden && "opacity-0",
              slot.z
            )}
          >
            {/* TODO: swap for the project screenshot once the images land. */}
            <ProjectPreview project={project} />

            <figcaption
              className={cn(
                "absolute inset-x-0 bottom-0 bg-dark-grey px-5 py-3 text-background",
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
  );
}

/**
 * Stands in for a project screenshot: the header strip, dark canvas and side panel
 * that would normally be shown in the project's own visual.
 */
function ProjectPreview({ project }: { project: Project }) {
  return (
    <div aria-hidden className="flex aspect-640/390 w-full flex-col bg-card">
      <div className="flex flex-col items-center gap-[0.8cqw] px-[2cqw] py-[1.4cqw]">
        <p className="text-[1.4cqw] font-bold">{project.title}</p>
        <p className="text-[0.7cqw] text-muted-foreground">{project.blurb}</p>
        <span className="bg-primary px-[1.2cqw] py-[0.4cqw] text-[0.6cqw] text-primary-foreground">
          Visualize
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        <NodeGraph className="min-w-0 flex-1 bg-dark-grey" />

        <div className="w-[22%] border-l border-border bg-card px-[1cqw] py-[1.2cqw]">
          <p className="text-[0.7cqw] font-bold">Node information</p>
          <p className="mt-[0.6cqw] text-[0.6cqw] text-muted-foreground">Name: &ndash;</p>
          <p className="text-[0.6cqw] text-muted-foreground">Degree: &ndash;</p>
        </div>
      </div>
    </div>
  );
}

function NodeGraph({ className }: { className?: string }) {
  // A fixed hash rather than Math.random, so the server and client agree.
  const scatter = (i: number, salt: number) => {
    const n = Math.sin((i + 1) * salt) * 10000;
    return n - Math.floor(n);
  };
  const nodes = Array.from({ length: 28 }, (_, i) => ({
    x: 12 + scatter(i, 12.9898) * 76,
    y: 10 + scatter(i, 78.233) * 80,
  }));

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      {nodes.map((node, i) =>
        nodes
          .slice(i + 1, i + 4)
          .map((other, j) => (
            <line
              key={`${i}-${j}`}
              x1={node.x}
              y1={node.y}
              x2={other.x}
              y2={other.y}
              stroke="currentColor"
              strokeWidth="0.3"
              className="text-background/35"
            />
          ))
      )}
      {nodes.map((node, i) => (
        <circle
          key={i}
          cx={node.x}
          cy={node.y}
          r="1.4"
          className={i % 7 === 0 ? "fill-primary" : "fill-background"}
        />
      ))}
    </svg>
  );
}
