/* Application identity/authorization schema.
 *
 * Roles live here rather than in neon_auth.user.role because Neon's Managed
 * Better Auth configures plugins through the Console/API rather than in code,
 * and does not support custom JWT claims — so the built-in field can't carry
 * permissions, can't be constrained by a foreign key, and is written through
 * an admin API gated behind a literal `admin` role.
 *
 * Tables are owned by app_admin. The migration itself connects as neondb_owner
 * — app_admin is no longer a neon_superuser member and is not the connecting
 * identity — so we SET ROLE for the duration. Without this the tables would be
 * owned by neondb_owner and the ALTER DEFAULT PRIVILEGES at the bottom, which
 * is scoped FOR ROLE app_admin, would silently never apply to them.
 *
 * app_public receives only the DML it needs, granted explicitly at the bottom.
 */

SET ROLE app_admin;

/* Editable role list: adding a role is an INSERT, not a migration. */
CREATE TABLE app_role (
  key        text PRIMARY KEY,
  label      text NOT NULL,
  rank       int  NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO app_role (key, label, rank) VALUES
  ('user',      'User',      0),
  ('hacker',    'Hacker',    10),
  ('volunteer', 'Volunteer', 20),
  ('organizer', 'Organizer', 30);

/* One role per user, in its own table rather than a column on user_profile.
 *
 * This separation is load-bearing for RLS: a policy on user_profile that reads
 * the role from user_profile raises "infinite recursion detected in policy".
 * Keeping the role in a table whose own policy is a self-read with no admin
 * clause means every other table can join against it safely.
 *
 * user_id intentionally has no FK to neon_auth."user"(id): that schema is
 * owned by the neon_auth role and app_admin is not guaranteed the REFERENCES
 * privilege on it. Integrity is maintained by the auth flow — a user_role row
 * is only ever written for an id that came from a verified session.
 */
CREATE TABLE user_role (
  user_id    uuid PRIMARY KEY,
  role       text NOT NULL REFERENCES app_role(key) ON UPDATE CASCADE,
  granted_by uuid,
  granted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX user_role_role_idx ON user_role (role);

/* Absence of a row means the base 'user' role — new sign-ups need no
 * provisioning webhook, the guard defaults when no row exists. */

CREATE TABLE user_profile (
  user_id    uuid PRIMARY KEY,
  school     text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

/* Audit trail for privilege changes: who made whom an organizer, and when. */
CREATE TABLE role_change_log (
  id          bigserial PRIMARY KEY,
  target_user uuid NOT NULL,
  old_role    text,
  new_role    text NOT NULL,
  changed_by  uuid,
  changed_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX role_change_log_target_idx ON role_change_log (target_user, changed_at DESC);

/* ---------------------------------------------------------------------------
 * Grants for the request-path role.
 *
 * app_public can read the role tables but never write them: role changes go
 * through grant_user_role() (see the rls-policies migration), a SECURITY
 * DEFINER function owned by app_admin. A bug in a route handler therefore
 * cannot escalate privileges — the connection lacks the privilege outright.
 * ------------------------------------------------------------------------ */

GRANT SELECT                         ON app_role        TO app_public;
GRANT SELECT                         ON user_role       TO app_public;
GRANT SELECT, INSERT, UPDATE         ON user_profile    TO app_public;
GRANT SELECT                         ON role_change_log TO app_public;

/* Future tables created by app_admin default to DML for app_public, so a new
 * table is usable by the app without also being writable in the role tables. */
ALTER DEFAULT PRIVILEGES FOR ROLE app_admin IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_public;

ALTER DEFAULT PRIVILEGES FOR ROLE app_admin IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO app_public;

/* Hand the session back to neondb_owner so db-migrate can record this
 * migration in its own bookkeeping table, which app_admin cannot write. */
RESET ROLE;
