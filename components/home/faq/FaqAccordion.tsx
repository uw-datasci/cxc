"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { FAQ_ITEMS } from "./faq-items";

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
      className="size-4 shrink-0 fill-transparent stroke-primary group-aria-expanded/accordion-trigger:fill-primary"
    >
      {/* Points are inset so the mitered corners are not clipped by the viewBox. */}
      <polygon points="8,1.6 14.4,8 8,14.4 1.6,8" strokeWidth={2} strokeLinejoin="miter" />
    </svg>
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
    <Accordion type="single" collapsible className="gap-8">
      {FAQ_ITEMS.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="bg-card shadow-[0_2px_4px_rgb(0_0_0/0.2)] not-last:border-b-0"
        >
          <AccordionTrigger className="items-center gap-6 border-0 px-8 py-4 font-mono text-base font-normal after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-linear-to-r after:from-primary/40 after:via-primary after:to-primary/40 hover:bg-muted hover:no-underline **:data-[slot=accordion-trigger-icon]:size-7 **:data-[slot=accordion-trigger-icon]:text-primary">
            <DiamondMarker />
            <span className="flex-1">{item.question}</span>
          </AccordionTrigger>

          {/* pl-16 lines the answer up with the question text. */}
          <AccordionContent className="pt-4 pr-8 pb-6 pl-16 font-mono text-base leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
