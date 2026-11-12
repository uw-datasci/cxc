import "server-only";

import type { PersonalStep, ProfileStep, QuestionsStep } from "@/types/application";
import { BaseRepository } from "@/server/shared/base.repository";

/** Row shape of `application`. */
export interface ApplicationRow {
  id: string;
  user_id: string;
  status: string;
  first_name: string | null;
  last_name: string | null;
  preferred_name: string | null;
  university: string | null;
  program: string | null;
  year_of_study: string | null;
  ethnicity: string | null;
  dietary_restrictions: string | null;
  gender: string | null;
  tshirt_size: string | null;
  hackathon_experience: string[];
  hackathons_attended: string | null;
  skills: string[];
  discord: string | null;
  github: string | null;
  linkedin: string | null;
  x_handle: string | null;
  resume_key: string | null;
  answer_goals: string | null;
  answer_project: string | null;
  answer_challenge: string | null;
  answer_fun_fact: string | null;
  submitted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Data access for the applications domain. Internal to this folder — the app layer goes
 * through `applications.service.ts`. RLS scopes every query to the bound user and only
 * lets a row be updated while it is a draft.
 */
export class ApplicationsRepository extends BaseRepository {
  constructor(userId: string) {
    super(userId);
  }

  /** The bound user's application, or `null` if they have not started one. */
  async findMine(): Promise<ApplicationRow | null> {
    return this.queryOne<ApplicationRow>(
      (txn) => txn`select * from application where user_id = ${this.userId}::uuid`
    );
  }

  /**
   * Creates an empty draft if the user has none. A no-op when a row already exists, so
   * the step updates below always have a row to write to.
   */
  async ensureDraft(): Promise<void> {
    await this.query(
      (txn) => txn`
        insert into application (user_id)
        values (${this.userId}::uuid)
        on conflict (user_id) do nothing`
    );
  }

  /** Writes step 1. Returns `null` when no draft row matched (e.g. already submitted). */
  async updateProfile(step: ProfileStep): Promise<ApplicationRow | null> {
    return this.queryOne<ApplicationRow>(
      (txn) => txn`
        update application set
          first_name     = ${step.firstName},
          last_name      = ${step.lastName},
          preferred_name = ${step.preferredName},
          updated_at     = now()
        where user_id = ${this.userId}::uuid and status = 'draft'
        returning *`
    );
  }

  /** Writes step 2. Returns `null` when no draft row matched. */
  async updatePersonal(step: PersonalStep): Promise<ApplicationRow | null> {
    return this.queryOne<ApplicationRow>(
      (txn) => txn`
        update application set
          university           = ${step.university},
          program              = ${step.program},
          year_of_study        = ${step.yearOfStudy},
          ethnicity            = ${step.ethnicity},
          dietary_restrictions = ${step.dietaryRestrictions},
          gender               = ${step.gender},
          tshirt_size          = ${step.tshirtSize},
          hackathon_experience = ${step.hackathonExperience}::text[],
          hackathons_attended  = ${step.hackathonsAttended},
          skills               = ${step.skills}::text[],
          discord              = ${step.discord},
          github               = ${step.github},
          linkedin             = ${step.linkedin},
          x_handle             = ${step.xHandle},
          resume_key           = ${step.resumeKey},
          updated_at           = now()
        where user_id = ${this.userId}::uuid and status = 'draft'
        returning *`
    );
  }

  /** Writes step 3. Returns `null` when no draft row matched. */
  async updateQuestions(step: QuestionsStep): Promise<ApplicationRow | null> {
    return this.queryOne<ApplicationRow>(
      (txn) => txn`
        update application set
          answer_goals     = ${step.goals},
          answer_project   = ${step.project},
          answer_challenge = ${step.challenge},
          answer_fun_fact  = ${step.funFact},
          updated_at       = now()
        where user_id = ${this.userId}::uuid and status = 'draft'
        returning *`
    );
  }

  /** Marks the draft submitted. Returns `null` when no draft row matched. */
  async markSubmitted(): Promise<ApplicationRow | null> {
    return this.queryOne<ApplicationRow>(
      (txn) => txn`
        update application set
          status       = 'submitted',
          submitted_at = now(),
          updated_at   = now()
        where user_id = ${this.userId}::uuid and status = 'draft'
        returning *`
    );
  }
}
