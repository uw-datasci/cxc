import { cn } from "@/lib/utils";

export function Marker({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("size-3 shrink-0 border-2 border-primary", className)} />
  );
}

export function MetaLine({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 font-mono text-sm tracking-widest uppercase">
      <Marker />
      {children}
    </li>
  );
}

export function HeroRule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-3", className)}>
      <Marker />
      <span className="h-px flex-1 bg-foreground" />
      <Marker />
      <Marker className="-ml-1" />
    </div>
  );
}
