"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/";

const TICK_MS = 55;
/** Random spread on each character's decode time, so letters don't resolve in lockstep. */
const DECODE_JITTER_MS = 120;
/** Idle bursts: the first comes this long after the decode finishes, then every 5–9s. */
const IDLE_FIRST_MS = 3000;
const GAP_MIN_MS = 5000;
const GAP_MAX_MS = 9000;
const TICKS_MIN = 5;
const TICKS_MAX = 8;
const STAGGER_MS = 90;

function randomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** A random glyph matching the case of `char`, so lowercase text scrambles in lowercase. */
function randomGlyph(char: string) {
  const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  return char === char.toUpperCase() ? glyph : glyph.toLowerCase();
}

/** Deterministic first frame, so the server and client render the same scrambled text. */
function initialGlyph(char: string, i: number, length: number) {
  if (char === " ") return null;
  const glyph = GLYPHS[(i * 7 + length * 3) % GLYPHS.length];
  return char === char.toUpperCase() ? glyph : glyph.toLowerCase();
}

type ScrambleTextProps = {
  text: string;
  /** When the first character resolves (ms after mount). */
  delay?: number;
  /** Time from the first character resolving to the last. */
  duration?: number;
  /** Keep scrambling two or three letters every few seconds after the decode. */
  idle?: boolean;
  /**
   * For monospaced fonts: render plain text, since every glyph is the same width. This keeps
   * ancestor styles like underlines working. Proportional text gets width-locked letters.
   */
  monospace?: boolean;
};

/**
 * Text that renders scrambled, decodes left to right into `text`, and optionally keeps
 * glitching a few letters now and then. Screen readers always get the real `text`. With
 * reduced motion the real text shows from the first paint, via CSS, and never scrambles.
 */
export function ScrambleText({
  text,
  delay = 0,
  duration = 600,
  idle = false,
  monospace = false,
}: Readonly<ScrambleTextProps>) {
  const chars = [...text];
  const [glyphs, setGlyphs] = useState<(string | null)[]>(() =>
    chars.map((char, i) => initialGlyph(char, i, chars.length))
  );

  useEffect(() => {
    const letters = [...text];
    const timeouts = new Set<number>();
    const intervals = new Set<number>();

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timeouts.delete(id);
        fn();
      }, ms);
      timeouts.add(id);
    };
    const every = (fn: (stop: () => void) => void, ms: number) => {
      const id = window.setInterval(() => fn(stop), ms);
      const stop = () => {
        window.clearInterval(id);
        intervals.delete(id);
      };
      intervals.add(id);
    };
    const cleanup = () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      intervals.forEach((id) => window.clearInterval(id));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      later(() => setGlyphs(letters.map(() => null)), 0);
      return cleanup;
    }

    const setGlyph = (index: number, glyph: string | null) =>
      setGlyphs((prev) => prev.map((g, i) => (i === index ? glyph : g)));

    const scramble = (index: number) => {
      let ticks = randomInt(TICKS_MIN, TICKS_MAX);
      setGlyph(index, randomGlyph(letters[index]));
      every((stop) => {
        ticks -= 1;
        if (ticks > 0) return setGlyph(index, randomGlyph(letters[index]));
        stop();
        setGlyph(index, null);
      }, TICK_MS);
    };

    const burst = () => {
      const pool = letters.flatMap((char, i) => (char === " " ? [] : [i]));
      const count = Math.min(randomInt(2, 3), pool.length);
      for (let n = 0; n < count; n++) {
        const [index] = pool.splice(Math.floor(Math.random() * pool.length), 1);
        later(() => scramble(index), n * STAGGER_MS);
      }
      later(burst, randomInt(GAP_MIN_MS, GAP_MAX_MS));
    };

    // Decode: every character flickers until its own resolve time, sweeping left to right.
    const span = Math.max(letters.length - 1, 1);
    const resolveAt = letters.map(
      (_, i) => delay + (i / span) * duration + Math.random() * DECODE_JITTER_MS
    );
    const end = Math.max(...resolveAt);
    const start = performance.now();

    every((stop) => {
      const elapsed = performance.now() - start;
      setGlyphs(
        letters.map((char, i) =>
          char === " " || elapsed >= resolveAt[i] ? null : randomGlyph(char)
        )
      );
      if (elapsed < end) return;
      stop();
      if (idle) later(burst, IDLE_FIRST_MS);
    }, TICK_MS);

    return cleanup;
  }, [text, delay, duration, idle]);

  if (monospace) {
    return (
      <>
        <span className="sr-only">{text}</span>
        <span aria-hidden className="motion-reduce:hidden">
          {chars.map((char, i) => glyphs[i] ?? char).join("")}
        </span>
        <span aria-hidden className="hidden motion-reduce:inline">
          {text}
        </span>
      </>
    );
  }

  // Group letters into words so lines wrap only at spaces, never between letters.
  const words: { start: number; letters: string[] }[] = [];
  chars.forEach((char, i) => {
    if (char === " ") return;
    const last = words.at(-1);
    if (last && chars[i - 1] !== " ") last.letters.push(char);
    else words.push({ start: i, letters: [char] });
  });

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map(({ start, letters }, w) => (
          // Index keys are stable here: the words and characters never reorder.
          <span key={start}>
            {w > 0 && " "}
            <span className="whitespace-nowrap">
              {letters.map((char, offset) => {
                const i = start + offset;
                return (
                  <span key={i} className="relative inline-block">
                    <span className="invisible motion-reduce:visible">{char}</span>
                    {/* Out of flow and centred on the real letter: wider glyphs overflow, not reflow. */}
                    <span
                      className={cn(
                        "absolute inset-y-0 left-1/2 -translate-x-1/2 motion-reduce:hidden",
                        glyphs[i] && "text-foreground"
                      )}
                    >
                      {glyphs[i] ?? char}
                    </span>
                  </span>
                );
              })}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
