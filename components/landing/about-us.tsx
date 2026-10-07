import { SectionBar } from "@/components/ui/section-bar";

const stats = [
  { value: "—", label: "Participants" },
  { value: "—", label: "Teams" },
  { value: "—", label: "Years running" },
];

export function AboutUs() {
  return (
    <section id="about-us" className="scroll-mt-8">
      <SectionBar number="01" title="About us" />

      <div className="flex flex-col gap-12 py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="flex flex-col gap-6">
            <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
              UWaterloo Data Science Competition
            </p>
            <h1 className="max-w-3xl font-bold uppercase">
              A space to apply data science to real-world problems.
            </h1>
            <div className="max-w-2xl space-y-4 text-base leading-relaxed">
              <p>
                This section is ready for the main introduction to CxC, its purpose, and the
                community it brings together.
              </p>
              <p className="text-muted-foreground">
                Replace this placeholder copy with the approved About Us content when it is
                ready.
              </p>
            </div>
          </div>

          <div
            aria-label="About Us image placeholder"
            className="min-h-64 border border-border bg-card"
          />
        </div>

        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="grid border-y border-border sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-2 border-border px-5 py-6 sm:border-r last:sm:border-r-0"
              >
                <span className="text-6xl font-bold">{stat.value}</span>
                <span className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
