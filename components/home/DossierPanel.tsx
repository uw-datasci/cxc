/** "Coming soon" card that replaces the Figma countdown, styled as a classified file. */
export function DossierPanel() {
  return (
    <section
      aria-labelledby="coming-soon-heading"
      className="w-full max-w-4xl border border-border bg-card p-6 md:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-sm tracking-widest uppercase">
        <span>File no. CXC-W27</span>
        <span className="border border-foreground px-2 py-0.5 font-bold">[Classified]</span>
      </div>

      <h2
        id="coming-soon-heading"
        className="relative mx-auto my-8 w-fit text-center text-5xl leading-none font-bold text-primary uppercase sm:text-6xl md:my-10 md:text-8xl"
      >
        Coming soon
        {/* Redaction bar that wipes away once the HUD has booted. */}
        <span
          aria-hidden
          className="absolute -inset-x-2 inset-y-0 origin-right animate-redact bg-foreground motion-reduce:hidden"
          style={{ animationDelay: "1100ms" }}
        />
      </h2>

      <p className="flex items-center gap-3 font-mono text-sm tracking-widest uppercase">
        <span aria-hidden className="size-2 shrink-0 border-2 border-primary" />
        Details will be declassified shortly
      </p>

      <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-4 font-mono text-sm tracking-widest">
        <span className="uppercase">Interested in sponsoring? Contact</span>
        <a
          href="mailto:outreach@uwdatascience.ca"
          className="font-bold underline decoration-primary decoration-2 underline-offset-4 outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          outreach@uwdatascience.ca
        </a>
      </p>
    </section>
  );
}
