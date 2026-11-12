/** Checkbox options from the "Prior hackathon experience" field (step 2). */
export const HACKATHON_EXPERIENCE = ["none", "hacker", "judge", "mentor", "organizer"] as const;
export type HackathonExperience = (typeof HACKATHON_EXPERIENCE)[number];

/** Checkbox options from the "Your strongest skills" field (step 2). */
export const SKILLS = [
  "data_analysis",
  "data_visualization",
  "machine_learning",
  "programming",
  "ui_ux_design",
  "project_management",
] as const;
export type Skill = (typeof SKILLS)[number];

/** Each application question answer is capped at this many words. */
export const MAX_ANSWER_WORDS = 300;

export type ApplicationStatus = "draft" | "submitted";

/** Step 1: profile setup. Email and password belong to the account, not the application. */
export interface ProfileStep {
  firstName: string | null;
  lastName: string | null;
  preferredName: string | null;
}

/** Step 2: personal details. */
export interface PersonalStep {
  university: string | null;
  program: string | null;
  yearOfStudy: string | null;
  ethnicity: string | null;
  dietaryRestrictions: string | null;
  gender: string | null;
  tshirtSize: string | null;
  hackathonExperience: HackathonExperience[];
  hackathonsAttended: string | null;
  skills: Skill[];
  discord: string | null;
  github: string | null;
  linkedin: string | null;
  xHandle: string | null;
  /** Storage key of the uploaded resume PDF. */
  resumeKey: string | null;
}

/** Step 3: application questions. */
export interface QuestionsStep {
  goals: string | null;
  project: string | null;
  challenge: string | null;
  funFact: string | null;
}

/** The steps a draft can be saved for, as used in `PUT /api/applications/steps/{step}`. */
export const APPLICATION_STEPS = ["profile", "personal", "questions"] as const;
export type ApplicationStep = (typeof APPLICATION_STEPS)[number];

export interface Application {
  id: string;
  status: ApplicationStatus;
  profile: ProfileStep;
  personal: PersonalStep;
  questions: QuestionsStep;
  submittedAt: string | null;
  updatedAt: string;
}
