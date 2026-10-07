import { SectionBar } from "@/components/ui/section-bar";

const stats = [
  { value: "—", label: "Participants" },
  { value: "—", label: "Teams" },
  { value: "—", label: "Years running" },
];

export function AboutUs() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      <SectionBar number="01" title="About us" />

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
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
              Replace this placeholder copy with the approved About Us content when it is ready.
            </p>
          </div>
        </div>

        <div
          aria-label="About Us image placeholder"
          className="min-h-64 border border-border bg-card"
        />
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 lg:px-8">
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
      </section>

      <SectionBar number="02" title="What we do" titleFirst />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 sm:grid-cols-3 lg:px-8">
        {["Competition", "Community", "Opportunity"].map((title, index) => (
          <article key={title} className="border border-border bg-card p-6">
            <p className="font-mono text-sm tracking-widest text-primary">0{index + 1}</p>
            <h2 className="mt-10 font-bold uppercase">{title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Add the supporting description for this part of the CxC experience.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
