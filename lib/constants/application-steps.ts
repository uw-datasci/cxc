/** One step of the application portal, as shown in the step header and progress bar. */
export interface ApplicationStepInfo {
  /** 1-based position in the flow. */
  number: number;
  /** Short name after "Step N:", e.g. "Profile setup". */
  name: string;
  /** The step's page title, e.g. "Let's get started". */
  title: string;
}

/** The four application steps, in order (Figma: CxC W27 "Application Web Dev"). */
export const APPLICATION_STEPS_INFO = [
  { number: 1, name: "Profile setup", title: "Let’s get started" },
  { number: 2, name: "Personal details", title: "About you" },
  { number: 3, name: "Application questions", title: "Your story" },
  { number: 4, name: "Review & submit", title: "Review application" },
] as const satisfies readonly ApplicationStepInfo[];

export type ApplicationStepNumber = (typeof APPLICATION_STEPS_INFO)[number]["number"];
