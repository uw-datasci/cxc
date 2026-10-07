import { SectionBar } from "@/components/ui/section-bar";

export function Team() {
  return (
    <section id="team" className="scroll-mt-8">
      <SectionBar number="05" title="Our team" />
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {[1, 2, 3, 4].map((member) => (
          <div key={member} className="border border-border bg-card p-6">
            <div
              aria-label="Team member image placeholder"
              className="aspect-square border border-border"
            />
            <p className="mt-5 font-mono text-sm tracking-widest text-muted-foreground uppercase">
              Team member
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
