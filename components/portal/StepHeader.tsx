import {
  APPLICATION_STEPS_INFO,
  type ApplicationStepNumber,
} from "@/lib/constants/application-steps";
import { cn } from "@/lib/utils";

/** "Step N: Name" eyebrow over the step's page title (Figma "Frame 237"). */
export function StepHeader({
  step,
  className,
}: {
  step: ApplicationStepNumber;
  className?: string;
}) {
  const { name, title } = APPLICATION_STEPS_INFO[step - 1];

  return (
    <header className={cn("flex flex-col gap-1.25", className)}>
      <p className="font-mono text-sm text-muted-foreground lg:text-xl">
        Step {step}: {name}
      </p>
      <h1 className="font-bold">{title}</h1>
    </header>
  );
}
