import { SectionBar } from "@/components/ui/section-bar";

const questions = [
  "Who can participate?",
  "How do I register?",
  "What should I bring to the competition?",
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-8">
      <SectionBar number="04" title="FAQ" titleFirst />
      <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <div className="border-y border-border">
          {questions.map((question) => (
            <div
              key={question}
              className="flex items-center justify-between gap-6 border-b border-border py-6 last:border-b-0"
            >
              <h2 className="font-bold uppercase">{question}</h2>
              <span className="font-mono text-sm text-muted-foreground">+</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
