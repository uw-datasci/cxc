SET ROLE app_admin;

/* One hacker application per user. Columns follow the application portal design
 * (Figma "CxC W27" → Application Web Dev): step 1 profile, step 2 personal details,
 * step 3 application questions. Every step column is nullable so drafts can be saved
 * one step at a time; ApplicationService checks completeness on submit. */
CREATE TABLE application (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL UNIQUE,
  status                text NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft', 'submitted')),

  -- Step 1: profile setup
  first_name            text,
  last_name             text,
  preferred_name        text,

  -- Step 2: personal details
  university            text,
  program               text,
  year_of_study         text,
  ethnicity             text,
  dietary_restrictions  text,
  gender                text,
  tshirt_size           text,
  hackathon_experience  text[] NOT NULL DEFAULT '{}',
  hackathons_attended   text,
  skills                text[] NOT NULL DEFAULT '{}',
  discord               text,
  github                text,
  linkedin              text,
  x_handle              text,
  resume_key            text,

  -- Step 3: application questions
  answer_goals          text,
  answer_project        text,
  answer_challenge      text,
  answer_fun_fact       text,

  submitted_at          timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE application ENABLE ROW LEVEL SECURITY;

/* Applicants read their own application; organizers read all of them. */
CREATE POLICY application_read ON application
  FOR SELECT TO app_public
  USING (
    user_id = (SELECT app_current_user_id())
    OR (SELECT app_current_role()) = 'organizer'
  );

/* Applicants create only their own row, and only as a draft. */
CREATE POLICY application_insert ON application
  FOR INSERT TO app_public
  WITH CHECK (
    user_id = (SELECT app_current_user_id())
    AND status = 'draft'
  );

/* Applicants edit their own row only while it is a draft. The draft → submitted
 * transition is allowed; a submitted row can no longer be changed or reopened. */
CREATE POLICY application_update ON application
  FOR UPDATE TO app_public
  USING (
    user_id = (SELECT app_current_user_id())
    AND status = 'draft'
  )
  WITH CHECK (
    user_id = (SELECT app_current_user_id())
    AND status IN ('draft', 'submitted')
  );

/* No DELETE policy: applications are never deleted from the request path. */
REVOKE DELETE ON TABLE application FROM app_public;

RESET ROLE;
