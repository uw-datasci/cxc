import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StepNavProps = {
  /** Where "Go back" leads. Omit it to show only "Continue". */
  backHref?: string;
  /** Navigate to this URL on "Continue". */
  continueHref?: string;
  /** Otherwise "Continue" submits the form with this `id` (it may live outside the nav). */
  formId?: string;
  continueLabel?: string;
  /** Disables "Continue" while a save is in flight. */
  pending?: boolean;
  className?: string;
};

/**
 * Bottom bar with "Go back" and "Continue" (Figma "Frame 235"/"Frame 238"), 107px tall.
 * It is sticky, so it stays pinned to the bottom of the viewport on every step.
 */
export function StepNav({
  backHref,
  continueHref,
  formId,
  continueLabel = "Continue",
  pending = false,
  className,
}: StepNavProps) {
  const continueContent = (
    <>
      {continueLabel}
      <CaretRightIcon aria-hidden className="size-7.5" />
    </>
  );

  return (
    <nav
      aria-label="Application steps"
      className={cn(
        "sticky bottom-0 z-10 shrink-0 border-t border-border bg-card px-6.25 pt-4 pb-8.5 lg:px-10.75",
        className
      )}
    >
      <div className="flex items-center justify-between gap-6 lg:max-w-[731px]">
        {backHref ? (
          <Button
            asChild
            variant="outline"
            className="h-14 w-31.25 justify-start gap-0 border-2 border-primary bg-card pl-0 text-lg text-primary shadow-none hover:border-dark-blue hover:bg-card hover:text-dark-blue"
          >
            <Link href={backHref}>
              <CaretLeftIcon aria-hidden className="size-7.5" />
              Go back
            </Link>
          </Button>
        ) : (
          <span aria-hidden />
        )}

        {continueHref ? (
          <Button
            asChild
            className="h-14 w-51.25 min-w-0 shrink justify-end gap-0 pr-0 text-lg"
          >
            <Link href={continueHref}>{continueContent}</Link>
          </Button>
        ) : (
          <Button
            type="submit"
            form={formId}
            disabled={pending}
            aria-busy={pending || undefined}
            className="h-14 w-51.25 min-w-0 shrink justify-end gap-0 pr-0 text-lg"
          >
            {continueContent}
          </Button>
        )}
      </div>
    </nav>
  );
}
