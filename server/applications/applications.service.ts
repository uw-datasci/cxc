import "server-only";

import {
  HACKATHON_EXPERIENCE,
  MAX_ANSWER_WORDS,
  SKILLS,
  type Application,
  type ApplicationStep,
  type HackathonExperience,
  type PersonalStep,
  type ProfileStep,
  type QuestionsStep,
  type Skill,
} from "@/types/application";

import { ApplicationsRepository, type ApplicationRow } from "./applications.repository";

/** Short single-line fields (names, dropdown values, handles). */
const MAX_SHORT_LENGTH = 200;
/** Hard cap on a free-text answer, so a word count can't hide a huge payload. */
const MAX_ANSWER_CHARS = 4000;

export type SaveStepResult =
  | { ok: true; application: Application }
  | { ok: false; reason: "invalid_input"; message: string }
  | { ok: false; reason: "already_submitted" };

export type SubmitResult =
  | { ok: true; application: Application }
  | { ok: false; reason: "not_started" | "already_submitted" }
  | { ok: false; reason: "incomplete"; missing: string[] };

type Parsed<T> = { ok: true; value: T } | { ok: false; message: string };

/** Business logic for hacker applications — the entry point the app layer uses. */
export class ApplicationService {
  private readonly repository: ApplicationsRepository;

  constructor(private readonly userId: string) {
    this.repository = new ApplicationsRepository(userId);
  }

  /** The caller's application, or `null` if they have not started one. */
  async getMine(): Promise<Application | null> {
    const row = await this.repository.findMine();
    return row && toApplication(row);
  }

  /**
   * Saves one step of the caller's draft, creating the draft on first save. Drafts may be
   * incomplete; only the field types, lengths, and options are checked here.
   */
  async saveStep(step: ApplicationStep, input: unknown): Promise<SaveStepResult> {
    const existing = await this.repository.findMine();
    if (existing?.status === "submitted") return { ok: false, reason: "already_submitted" };

    if (!isRecord(input)) {
      return { ok: false, reason: "invalid_input", message: "Body must be a JSON object." };
    }

    let row: ApplicationRow | null;
    switch (step) {
      case "profile": {
        const parsed = parseProfile(input);
        if (!parsed.ok) return { ok: false, reason: "invalid_input", message: parsed.message };
        if (!existing) await this.repository.ensureDraft();
        row = await this.repository.updateProfile(parsed.value);
        break;
      }
      case "personal": {
        const parsed = parsePersonal(input);
        if (!parsed.ok) return { ok: false, reason: "invalid_input", message: parsed.message };
        if (!existing) await this.repository.ensureDraft();
        row = await this.repository.updatePersonal(parsed.value);
        break;
      }
      case "questions": {
        const parsed = parseQuestions(input);
        if (!parsed.ok) return { ok: false, reason: "invalid_input", message: parsed.message };
        if (!existing) await this.repository.ensureDraft();
        row = await this.repository.updateQuestions(parsed.value);
        break;
      }
    }

    // The only way an update matches nothing is a submit landing in between.
    if (!row) return { ok: false, reason: "already_submitted" };
    return { ok: true, application: toApplication(row) };
  }

  /** Submits the caller's draft once every required field is filled in. */
  async submit(): Promise<SubmitResult> {
    const existing = await this.repository.findMine();
    if (!existing) return { ok: false, reason: "not_started" };
    if (existing.status === "submitted") return { ok: false, reason: "already_submitted" };

    const missing = missingRequiredFields(toApplication(existing));
    if (missing.length > 0) return { ok: false, reason: "incomplete", missing };

    const row = await this.repository.markSubmitted();
    if (!row) return { ok: false, reason: "already_submitted" };
    return { ok: true, application: toApplication(row) };
  }
}

/* ---------------------------------------------------------------------------
 * Validation
 * ------------------------------------------------------------------------ */

/** Fields the design marks with `*`, keyed the way the client names them. */
function missingRequiredFields(app: Application): string[] {
  const { profile, personal, questions } = app;
  const required: Record<string, unknown> = {
    "profile.firstName": profile.firstName,
    "profile.lastName": profile.lastName,
    "personal.university": personal.university,
    "personal.program": personal.program,
    "personal.yearOfStudy": personal.yearOfStudy,
    "personal.dietaryRestrictions": personal.dietaryRestrictions,
    "personal.tshirtSize": personal.tshirtSize,
    "personal.hackathonExperience": personal.hackathonExperience.length || null,
    "personal.hackathonsAttended": personal.hackathonsAttended,
    "personal.skills": personal.skills.length || null,
    "personal.discord": personal.discord,
    "personal.github": personal.github,
    "personal.resumeKey": personal.resumeKey,
    "questions.goals": questions.goals,
    "questions.project": questions.project,
    "questions.challenge": questions.challenge,
    "questions.funFact": questions.funFact,
  };

  return Object.entries(required)
    .filter(([, value]) => value === null)
    .map(([key]) => key);
}

function parseProfile(input: Record<string, unknown>): Parsed<ProfileStep> {
  try {
    return {
      ok: true,
      value: {
        firstName: optionalText(input, "firstName"),
        lastName: optionalText(input, "lastName"),
        preferredName: optionalText(input, "preferredName"),
      },
    };
  } catch (error) {
    return invalid(error);
  }
}

function parsePersonal(input: Record<string, unknown>): Parsed<PersonalStep> {
  try {
    const hackathonExperience = optionalOptions(input, "hackathonExperience", HACKATHON_EXPERIENCE);
    if (hackathonExperience.includes("none") && hackathonExperience.length > 1) {
      throw new FieldError("hackathonExperience cannot combine \"none\" with other options.");
    }

    return {
      ok: true,
      value: {
        university: optionalText(input, "university"),
        program: optionalText(input, "program"),
        yearOfStudy: optionalText(input, "yearOfStudy"),
        ethnicity: optionalText(input, "ethnicity"),
        dietaryRestrictions: optionalText(input, "dietaryRestrictions"),
        gender: optionalText(input, "gender"),
        tshirtSize: optionalText(input, "tshirtSize"),
        hackathonExperience: hackathonExperience as HackathonExperience[],
        hackathonsAttended: optionalText(input, "hackathonsAttended"),
        skills: optionalOptions(input, "skills", SKILLS) as Skill[],
        discord: optionalText(input, "discord"),
        github: optionalText(input, "github"),
        linkedin: optionalText(input, "linkedin"),
        xHandle: optionalText(input, "xHandle"),
        resumeKey: optionalText(input, "resumeKey"),
      },
    };
  } catch (error) {
    return invalid(error);
  }
}

function parseQuestions(input: Record<string, unknown>): Parsed<QuestionsStep> {
  try {
    return {
      ok: true,
      value: {
        goals: optionalAnswer(input, "goals"),
        project: optionalAnswer(input, "project"),
        challenge: optionalAnswer(input, "challenge"),
        funFact: optionalAnswer(input, "funFact"),
      },
    };
  } catch (error) {
    return invalid(error);
  }
}

/** Thrown inside the parsers only; always caught and turned into an `invalid_input`. */
class FieldError extends Error {}

function invalid(error: unknown): Parsed<never> {
  if (error instanceof FieldError) return { ok: false, message: error.message };
  throw error;
}

/** A trimmed string, or `null` when absent or blank. */
function optionalText(
  input: Record<string, unknown>,
  key: string,
  maxLength = MAX_SHORT_LENGTH
): string | null {
  const value = input[key];
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") throw new FieldError(`${key} must be a string.`);

  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new FieldError(`${key} must be at most ${maxLength} characters.`);
  }
  return trimmed.length > 0 ? trimmed : null;
}

function optionalAnswer(input: Record<string, unknown>, key: string): string | null {
  const answer = optionalText(input, key, MAX_ANSWER_CHARS);
  if (answer && countWords(answer) > MAX_ANSWER_WORDS) {
    throw new FieldError(`${key} must be at most ${MAX_ANSWER_WORDS} words.`);
  }
  return answer;
}

/** A de-duplicated list drawn from `options`; absent means an empty list. */
function optionalOptions(
  input: Record<string, unknown>,
  key: string,
  options: readonly string[]
): string[] {
  const value = input[key];
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || !value.every((item) => options.includes(item))) {
    throw new FieldError(`${key} must be a list of: ${options.join(", ")}.`);
  }
  return [...new Set(value as string[])];
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/* ---------------------------------------------------------------------------
 * Mapping
 * ------------------------------------------------------------------------ */

function toApplication(row: ApplicationRow): Application {
  return {
    id: row.id,
    status: row.status === "submitted" ? "submitted" : "draft",
    profile: {
      firstName: row.first_name,
      lastName: row.last_name,
      preferredName: row.preferred_name,
    },
    personal: {
      university: row.university,
      program: row.program,
      yearOfStudy: row.year_of_study,
      ethnicity: row.ethnicity,
      dietaryRestrictions: row.dietary_restrictions,
      gender: row.gender,
      tshirtSize: row.tshirt_size,
      hackathonExperience: row.hackathon_experience.filter((item): item is HackathonExperience =>
        (HACKATHON_EXPERIENCE as readonly string[]).includes(item)
      ),
      hackathonsAttended: row.hackathons_attended,
      skills: row.skills.filter((item): item is Skill =>
        (SKILLS as readonly string[]).includes(item)
      ),
      discord: row.discord,
      github: row.github,
      linkedin: row.linkedin,
      xHandle: row.x_handle,
      resumeKey: row.resume_key,
    },
    questions: {
      goals: row.answer_goals,
      project: row.answer_project,
      challenge: row.answer_challenge,
      funFact: row.answer_fun_fact,
    },
    submittedAt: row.submitted_at ? new Date(row.submitted_at).toISOString() : null,
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}
