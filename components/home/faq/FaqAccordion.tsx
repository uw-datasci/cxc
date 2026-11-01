"use client";

import { Fragment } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { type FaqAnswer, FAQ_ITEMS } from "@/lib/constants/faq";

/**
 * Sharp-cornered diamond marker: outline when closed, filled when open.
 *
 * Must be rendered inside `AccordionTrigger` so the `group-aria-expanded`
 * variant can see the trigger's open state.
 */
function DiamondMarker() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="size-5 shrink-0 fill-transparent stroke-primary group-aria-expanded/accordion-trigger:fill-primary"
    >
      <polygon points="8,1.8 14.2,8 8,14.2 1.8,8" strokeWidth={2.5} strokeLinejoin="miter" />
    </svg>
  );
}

/**
 * Renders an FAQ answer: plain text as-is, or a list of text and link parts.
 */
function FaqAnswerContent({ answer }: { answer: FaqAnswer }) {
  if (typeof answer === "string") return <>{answer}</>;

  return (
    <>
      {answer.map((part, index) =>
        typeof part === "string" ? (
          <Fragment key={index}>{part}</Fragment>
        ) : (
          <a
            key={index}
            href={part.href}
            target="_blank"
            rel="noreferrer"
            className="text-black underline underline-offset-2"
          >
            {part.text}
          </a>
        )
      )}
    </>
  );
}

/**
 * FAQ list built on the shadcn accordion, restyled as stacked cards.
 *
 * All styling is passed in through `className` so the shared primitive in
 * `components/ui/accordion.tsx` stays untouched. Only one item is open at a
 * time, and clicking the open item closes it.
 */
export function FaqAccordion() {
  return (
    <Accordion type="single" collapsible className="gap-6">
      {FAQ_ITEMS.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="bg-card shadow-[0_3px_5px_rgb(0_0_0/0.2)] not-last:border-b-0"
        >
          <AccordionTrigger className="items-center gap-6 border-0 px-6 py-4 font-mono text-base font-normal after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-linear-to-r after:from-primary/40 after:via-primary after:to-primary/40 hover:bg-muted hover:no-underline **:data-[slot=accordion-trigger-icon]:size-7 **:data-[slot=accordion-trigger-icon]:text-primary">
            <DiamondMarker />
            <span className="flex-1">{item.question}</span>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pr-6 pb-6 pl-17 font-mono text-sm leading-relaxed">
            <FaqAnswerContent answer={item.answer} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
