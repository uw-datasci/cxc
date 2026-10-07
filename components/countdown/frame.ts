/**
 * The Figma `Countdown` frame.
 *
 * Every coordinate in the countdown components is expressed in these units, and
 * `CountdownStage` scales the whole frame as one unit to fit the viewport.
 *
 * This lives in its own module rather than beside the stage: the stage is a
 * client component, and when a server component imports from a `"use client"`
 * module, Next replaces every export with a client-reference proxy — reading
 * `FRAME.width` off one of those yields `undefined`.
 */
export const FRAME = { width: 1280, height: 832 } as const;
