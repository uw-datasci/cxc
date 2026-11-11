import {
  APPLICATION_STEPS_INFO,
  type ApplicationStepNumber,
} from "@/lib/constants/application-steps";
import { cn } from "@/lib/utils";

/**
 * Diamond-and-rule progress bar (Figma "Frame 214"). Reached steps, and the rules leading
 * to them, are BLUE; upcoming ones are GRID GREY. It stretches to the content column.
 */
export function StepProgress({
  current,
  className,
}: {
  current: ApplicationStepNumber;
  className?: string;
}) {
  return (
    <ol aria-label="Application progress" className={cn("flex items-center", className)}>
      {APPLICATION_STEPS_INFO.map((step) => {
        const reached = step.number <= current;
        const state =
          step.number < current
            ? "completed"
            : step.number === current
              ? "current"
              : "upcoming";

        return (
          <li
            key={step.number}
            aria-current={state === "current" ? "step" : undefined}
            className={cn(
              "flex items-center gap-4 lg:gap-5.75",
              step.number > 1 && "flex-1 pl-4 lg:pl-5.75"
            )}
          >
            {step.number > 1 && (
              <span
                aria-hidden
                className={cn("h-[2.5px] flex-1", reached ? "bg-primary" : "bg-border")}
              />
            )}
            {/* A square turned 45°: 8px (mobile) / 9.77px (desktop) sides, as in Figma. */}
            <span
              aria-hidden
              className="flex size-[11.3px] shrink-0 items-center justify-center lg:size-[13.8px]"
            >
              <span
                className={cn(
                  "size-2 rotate-45 lg:size-[9.77px]",
                  reached ? "bg-primary" : "bg-border"
                )}
              />
            </span>
            <span className="sr-only">
              Step {step.number}: {step.name} ({state})
            </span>
          </li>
        );
      })}
    </ol>
  );
}
