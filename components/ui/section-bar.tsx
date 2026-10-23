import { cn } from "@/lib/utils";

type SectionBarProps = {
  number?: string | number;
  title: string;
  titleFirst?: boolean;
  className?: string;
  titleClassName?: string;
};

export function SectionBar({
  number,
  title,
  titleFirst = false,
  className,
  titleClassName,
}: SectionBarProps) {
  return (
    <div
      aria-label={`${number} ${title}`}
      className={cn(
        "mx-6 flex h-18 max-w-7xl items-center justify-between overflow-hidden bg-primary px-10 text-background min-[1328px]:mx-auto sm:px-18",
        className
      )}
    >
      {number && (
        <span
          className={cn(
            "shrink-0 text-[7rem] leading-none font-bold uppercase",
            titleFirst ? "order-2" : "order-1"
          )}
        >
          {number}
        </span>
      )}

      <span
        className={cn(
          "text min-w-0 truncate text-header-main font-bold uppercase",
          titleFirst ? "order-1 text-left" : "order-2 text-right",
          titleClassName
        )}
      >
        {title}
      </span>
    </div>
  );
}
