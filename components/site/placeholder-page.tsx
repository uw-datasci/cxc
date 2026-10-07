import { Nav } from "@/components/nav";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <Nav />
      <main className="flex flex-1 items-center p-6 lg:p-8">
        <div className="max-w-2xl">
          <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
            CxC - UWaterloo Data Science Competition
          </p>
          <h1 className="mt-3 font-bold uppercase">{title}</h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </main>
    </div>
  );
}
