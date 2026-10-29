import Image from "next/image";

import { SectionBar } from "@/components/ui/section-bar";

import { FaqAccordion } from "./FaqAccordion";

export function FaqSection() {
  return (
    <section id="faq" className="relative overflow-hidden py-10">
      <SectionBar
        title="FREQUENTLY ASKED"
        titleClassName="text-header-sub sm:text-header-main"
      />

      <div className="relative mt-28 lg:min-h-250">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 hidden h-276 w-[55%] lg:block"
        >
          <div className="absolute inset-0 origin-top-left -translate-y-4 scale-[0.92]">
            <Image src="/home/grid.svg" alt="" fill className="object-contain object-left" />
          </div>
          <Image
            src="/home/faq-terrain.svg"
            alt=""
            fill
            className="object-contain object-left"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:pt-10">
          <div className="mt-4 flex flex-col items-center gap-20 md:gap-24 lg:ml-auto lg:w-160">
            <FaqAccordion />
            <div className="flex flex-col items-center gap-20 pb-36 md:gap-26">
              <p className="font-mono text-base leading-relaxed">
                Have more questions? Feel free to reach out to us at{" "}
                <a
                  href="mailto:contact@uwdatascience.ca"
                  className="text-primary underline underline-offset-2"
                >
                  contact@uwdatascience.ca
                </a>{" "}
                or in the discord with any questions.
              </p>

              <Image
                src="/home/stripes.svg"
                alt=""
                width={600}
                height={37}
                className="h-auto w-150"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
