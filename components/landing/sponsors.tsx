import { SectionBar } from "@/components/ui/section-bar";

export function Sponsors() {
  return (
    <section id="sponsors" className="scroll-mt-8">
      <SectionBar number="03" title="Our sponsors" />
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-16 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {[1, 2, 3].map((sponsor) => (
          <div
            key={sponsor}
            className="flex min-h-36 items-center justify-center border border-border bg-card font-mono text-sm tracking-widest text-muted-foreground uppercase"
          >
            Sponsor logo
          </div>
        ))}
      </div>
    </section>
  );
}
