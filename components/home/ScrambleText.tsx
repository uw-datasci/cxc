"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/";

/** First burst lands after the redaction wipe (1100ms delay + 500ms) has settled. */
const FIRST_MS = 3200;
const GAP_MIN_MS = 5000;
const GAP_MAX_MS = 9000;
const TICK_MS = 55;
const TICKS_MIN = 5;
const TICKS_MAX = 8;
const STAGGER_MS = 90;

function randomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/**
 * Text where, every few seconds, two or three letters briefly cycle through cipher glyphs
 * and resolve back. Each letter's width is held by an invisible copy of itself, so the
 * word never reflows. Decorative only: callers should pair it with sr-only text. No
 * scrambling under reduced motion.
 */
export function ScrambleText({ text }: Readonly<{ text: string }>) {
  const chars = [...text];
  const [glyphs, setGlyphs] = useState<(string | null)[]>(() => chars.map(() => null));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeouts = new Set<number>();
    const intervals = new Set<number>();
    const letters = [...text].flatMap((char, i) => (char === " " ? [] : [i]));

    const setGlyph = (index: number, glyph: string | null) =>
      setGlyphs((prev) => prev.map((g, i) => (i === index ? glyph : g)));

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timeouts.delete(id);
        fn();
      }, ms);
      timeouts.add(id);
    };

    const scramble = (index: number) => {
      let ticks = randomInt(TICKS_MIN, TICKS_MAX);
      setGlyph(index, randomGlyph());
      const id = window.setInterval(() => {
        ticks -= 1;
        if (ticks > 0) return setGlyph(index, randomGlyph());
        window.clearInterval(id);
        intervals.delete(id);
        setGlyph(index, null);
      }, TICK_MS);
      intervals.add(id);
    };

    const burst = () => {
      const pool = [...letters];
      const count = Math.min(randomInt(2, 3), pool.length);
      for (let n = 0; n < count; n++) {
        const [index] = pool.splice(Math.floor(Math.random() * pool.length), 1);
        later(() => scramble(index), n * STAGGER_MS);
      }
      later(burst, randomInt(GAP_MIN_MS, GAP_MAX_MS));
    };

    later(burst, FIRST_MS);
    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      intervals.forEach((id) => window.clearInterval(id));
    };
  }, [text]);

  return chars.map((char, i) =>
    char === " " ? (
      " "
    ) : (
      // Index keys are stable here: the characters never reorder.
      <span key={i} className="relative inline-block">
        <span className="invisible">{char}</span>
        {/* Out of flow and centred on the real letter, so wider glyphs overflow, not reflow. */}
        <span
          className={cn(
            "absolute inset-y-0 left-1/2 -translate-x-1/2",
            glyphs[i] && "text-foreground"
          )}
        >
          {glyphs[i] ?? char}
        </span>
      </span>
    )
  );
}
