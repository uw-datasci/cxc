import type { ReactNode } from "react";

import { PortalShell } from "@/components/portal/PortalShell";
import { StepHeader } from "@/components/portal/StepHeader";
import { StepProgress } from "@/components/portal/StepProgress";
import type { ApplicationStepNumber } from "@/lib/constants/application-steps";

/**
 * Layout of one numbered application step: progress bar, step header, the step's content,
 * and the pinned {@link StepNav} passed as `nav`.
 *
 * Spacing follows the Figma frames: on desktop the progress bar sits 84px from the top and
 * the content column is 731px wide with 43px gutters; on mobile the gutters are 25px.
 */
export function ApplicationStep({
  step,
  nav,
  children,
}: {
  step: ApplicationStepNumber;
  nav: ReactNode;
  children: ReactNode;
}) {
  return (
    <PortalShell>
      <main className="flex-1 px-6.25 pb-12 lg:px-10.75">
        <div className="lg:max-w-[731px]">
          <StepProgress current={step} className="mt-6.5 lg:mt-21" />
          <StepHeader step={step} className="mt-7.75 lg:mt-19.5" />
          <div className="mt-5.75 lg:mt-12.75">{children}</div>
        </div>
      </main>
      {nav}
    </PortalShell>
  );
}
