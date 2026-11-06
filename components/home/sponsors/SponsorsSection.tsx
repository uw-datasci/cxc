import { SectionBar } from "@/components/ui/section-bar";
import { SPONSOR_TIERS, type SponsorTier } from "@/lib/constants/sponsors";
import { cn } from "@/lib/utils";

export function SponsorsSection() {
  return (
    <section id="sponsors" className="relative scroll-mt-8 overflow-hidden py-10">
      <HudMarkers />

      <SectionBar number="03" title="Our sponsors" className="relative" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pt-14 sm:px-10">
        {SPONSOR_TIERS.map((tier) => (
          <TierBlock key={tier.id} tier={tier} />
        ))}
      </div>

      <p className="relative mx-auto mt-16 max-w-7xl px-6 text-center font-mono text-xs uppercase sm:px-10 sm:text-xl">
        Want to become a sponsor?{" "}
        {/* TODO: point at the sponsorship form once the URL is confirmed. */}
        <a
          href="#"
          className="text-primary underline underline-offset-4 hover:text-dark-blue focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Fill out this form
        </a>
      </p>
    </section>
  );
}

function TierBlock({ tier }: { tier: SponsorTier }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h3
        className="bg-clip-text text-center font-mono text-base font-bold text-transparent uppercase sm:text-2xl md:text-3xl"
        style={{ backgroundImage: tier.gradient }}
      >
        {tier.label}
      </h3>

      <ul
        className={cn(
          "flex flex-wrap justify-center gap-x-3 gap-y-6 sm:justify-between sm:gap-x-0 sm:gap-y-9",
          tier.row
        )}
      >
        {Array.from({ length: tier.slots }, (_, index) => (
          <li key={index} className={tier.tile}>
            <SponsorTile className={tier.aspect} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SponsorTile({ className }: { className?: string }) {
  return (
    // TODO: replace with sponsor logos once the roster is confirmed.
    <div aria-hidden className={cn("relative w-full", className)}>
      <span className="absolute top-0 left-0 h-1/4 w-1/5 border-t-2 border-l-2 border-primary" />
      <span className="absolute right-0 bottom-0 h-1/4 w-1/5 border-r-2 border-b-2 border-primary" />
      <div className="absolute inset-1.5 bg-card sm:inset-2.5" />
    </div>
  );
}

function HudMarkers() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
      <div className="relative mx-auto h-full w-full max-w-7xl">
        <span className="absolute top-[9.8%] left-[91.5%] size-2.25 border-2 border-primary" />
        <span className="absolute top-[10.1%] left-[84.2%] h-px w-[6.6%] bg-foreground" />
        <span className="absolute top-[11.2%] left-[91.9%] h-[21.4%] w-px bg-foreground" />
        <span className="absolute top-[91.6%] left-[8.2%] h-[5.7%] w-px bg-foreground" />
        <span className="absolute top-[97.8%] left-[7.8%] size-2.25 border-2 border-primary" />
        <span className="absolute top-[98.9%] left-[7.8%] size-2.25 border-2 border-primary" />
      </div>
    </div>
  );
}
