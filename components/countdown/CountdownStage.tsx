"use client";

import { useSyncExternalStore } from "react";

import { FRAME } from "./frame";

/*
 * The viewport as an external store.
 *
 * Same reasoning as the countdown clock: this reads a browser value React
 * doesn't own, and `useSyncExternalStore` hydrates cleanly — the server render
 * and the hydration pass both use `getServerSnapshot`, so the markup matches
 * and the real size only arrives afterwards. One store, many subscribers, so
 * every layer scales off the same measurement.
 */
let snapshot: string | null = null;
const listeners = new Set<() => void>();

const readViewport = () => `${window.innerWidth}x${window.innerHeight}`;

function handleResize() {
  const next = readViewport();
  // Cached so repeated getSnapshot calls return a stable value; a fresh string
  // every call would look like an endless change to React.
  if (next === snapshot) return;
  snapshot = next;
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (listeners.size === 1) {
    snapshot = readViewport();
    window.addEventListener("resize", handleResize);
  }
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0) window.removeEventListener("resize", handleResize);
  };
}

const getSnapshot = () => snapshot ?? (snapshot = readViewport());
const getServerSnapshot = () => null;

/**
 * One layer of the frame, scaled to the viewport.
 *
 * - `fit` keeps the whole 1280 x 832 frame on screen. Used for content and
 *   decoration, because filling would crop whichever axis is relatively short
 *   — on a 2000x1060 window that is 77 design px off the top and bottom, which
 *   is exactly the UW DSC mark and the waiting-list CTA.
 * - `cover` fills the viewport, overflowing the short axis. Used for the
 *   artwork, so the map always reaches the screen edge instead of leaving bare
 *   canvas beside it.
 *
 * At the frame's own aspect ratio the two scales are identical and everything
 * lines up exactly; off-aspect, the artwork simply extends further than the
 * content. Both are centred, so they stay concentric either way.
 */
export function StageLayer({
  mode,
  children,
}: {
  mode: "fit" | "cover";
  children: React.ReactNode;
}) {
  const viewport = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // 1 before hydration, which is exactly right at the frame's own size.
  let scale = 1;
  if (viewport) {
    const [w, h] = viewport.split("x").map(Number);
    const byWidth = w / FRAME.width;
    const byHeight = h / FRAME.height;
    scale = mode === "cover" ? Math.max(byWidth, byHeight) : Math.min(byWidth, byHeight);
  }

  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        width: FRAME.width,
        height: FRAME.height,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
    >
      {children}
    </div>
  );
}

/** The page shell: a full-viewport, clipped, grey canvas for the layers. */
export function CountdownStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-svh w-full overflow-hidden bg-background">{children}</div>
  );
}
