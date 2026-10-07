import { SectionBar } from "@/components/ui/section-bar";

const projects = ["Competition", "Community", "Opportunity"];

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-8">
      <SectionBar number="02" title="Projects" />
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-16 sm:grid-cols-3 lg:px-8">
        {projects.map((title, index) => (
          <article key={title} className="border border-border bg-card p-6">
            <p className="font-mono text-sm tracking-widest text-primary">0{index + 1}</p>
            <h2 className="mt-10 font-bold uppercase">{title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Add the supporting description for this part of the CxC experience.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
