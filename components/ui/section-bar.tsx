import { cn } from "@/lib/utils";

type SectionBarProps = {
  number: string | number;
  title: string;
  titleFirst?: boolean;
  className?: string;
};

export function SectionBar({ number, title, titleFirst = false, className }: SectionBarProps) {
  return (
    <div
      aria-label={`${number} ${title}`}
      className={cn(
        "mx-6 flex h-16 items-center justify-between overflow-hidden bg-primary text-background lg:mx-8",
        className
      )}
    >
      <span
        className={cn(
          "shrink-0 text-7xl leading-none font-bold uppercase sm:text-8xl",
          titleFirst ? "order-2" : "order-1"
        )}
      >
        {number}
      </span>
      <span
        className={cn(
          "min-w-0 truncate px-4 text-header-sub font-bold uppercase sm:px-6",
          titleFirst ? "order-1 text-left" : "order-2 text-right"
        )}
      >
        {title}
      </span>
    </div>
  );
}
