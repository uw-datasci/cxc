/* ONE-TIME ROLE BOOTSTRAP — run this in the Neon SQL Editor, once per database.
 * ===========================================================================
 *
 * This is deliberately NOT a migration. Roles are infrastructure, like the
 * database itself; migrations manage what lives inside it. Keeping role
 * creation here means no password ever has to be handed to `pnpm migrate`.
 *
 * RUN IT IN THE NEON SQL EDITOR, NOT THE ROLES TAB. This matters and is the
 * whole reason this file exists:
 *
 *   - Roles created through the Neon Console "Roles" tab, the CLI, the API, or
 *     the Vercel integration are granted `neon_superuser` by `cloud_admin` —
 *     which carries pg_read_all_data and pg_write_all_data — and are given
 *     BYPASSRLS, CREATEROLE and CREATEDB directly. A role like that reads and
 *     writes every table and skips every RLS policy, and you cannot take any of
 *     it back: Postgres 16+ needs ADMIN OPTION to revoke a role membership, and
 *     only Neon's control plane holds it. DROP ROLE and ALTER ROLE are refused
 *     for the same reason.
 *
 *   - The SQL Editor connects as neondb_owner, so roles created here are
 *     ordinary SQL-created roles: no neon_superuser, no BYPASSRLS, no
 *     CREATEROLE, no CREATEDB. Which is exactly what we want.
 *
 * The password must be present in CREATE ROLE itself — Neon's control-plane
 * sync refuses to serialize a role with no password ("Failed to get encrypted
 * password", ddl_forwarding.c / SerializeRoleEntry), so `CREATE ROLE ... LOGIN`
 * followed by a later `ALTER ROLE ... PASSWORD` fails at commit. Rotation via
 * ALTER ROLE does work once a password exists (see the bottom of this file).
 */

/* --- STEP 1 -----------------------------------------------------------------
 * Generate the passwords and create both roles, in one run.
 *
 * DO NOT rewrite this as `CREATE ROLE app_public LOGIN PASSWORD '<literal>'`.
 * Neon's SQL Editor saves the text of every query you run to its History pane
 * and keeps it, so a pasted-in literal would leave both production credentials
 * sitting in the Neon console for anyone with project access, indefinitely.
 * Generating inside the statement means the query text saved to History
 * contains no secret — only the expression that produced it.
 *
 * gen_random_uuid() is built into Postgres 13+ (no pgcrypto needed) and returns
 * a v4 UUID from the server's strong RNG. Two of them, dashes stripped, give 64
 * hex characters — well past any brute-force concern, and hex means the value
 * drops into a connection string with no percent-encoding.
 *
 * The passwords are parked in a table rather than returned directly because
 * CREATE ROLE cannot run inside a CTE and a DO block cannot return a result
 * set. A plain table (not TEMP) is used so the value survives regardless of how
 * the editor pools connections between statements. Step 3 removes it.
 */

CREATE TABLE _bootstrap_pw AS
SELECT
  replace(gen_random_uuid()::text, '-', '') ||
  replace(gen_random_uuid()::text, '-', '') AS admin_pw,
  replace(gen_random_uuid()::text, '-', '') ||
  replace(gen_random_uuid()::text, '-', '') AS public_pw;

DO $$
DECLARE
  a text;
  p text;
BEGIN
  SELECT admin_pw, public_pw INTO a, p FROM _bootstrap_pw;
  EXECUTE format('CREATE ROLE app_admin  LOGIN PASSWORD %L', a);
  EXECUTE format('CREATE ROLE app_public LOGIN PASSWORD %L', p);
END $$;

/* --- STEP 2 -----------------------------------------------------------------
 * Read the passwords out and store them (Infisical, password manager) along
 * with the connection strings from Step 5. Run this on its own so the result
 * grid shows it.
 */

SELECT admin_pw AS app_admin_password, public_pw AS app_public_password
FROM   _bootstrap_pw;

/* --- STEP 3 -----------------------------------------------------------------
 * Once you have stored both values, delete the scratch table. Do not skip this
 * — it holds two plaintext passwords in a table app_admin can read.
 */

DROP TABLE _bootstrap_pw;

/* --- STEP 4 -----------------------------------------------------------------
 * Confirm the roles came out unprivileged. Every boolean below must be false —
 * if any is true you created them outside the SQL Editor and they are
 * control-plane roles that cannot be fixed in place. Delete them from the Neon
 * dashboard and redo Step 1 here.
 */

SELECT rolname, rolsuper, rolcreaterole, rolcreatedb, rolbypassrls,
       pg_has_role(rolname, 'neon_superuser',   'usage') AS neon_superuser,
       pg_has_role(rolname, 'pg_read_all_data', 'usage') AS reads_everything
FROM   pg_roles
WHERE  rolname IN ('app_admin', 'app_public');

/* --- STEP 5 -----------------------------------------------------------------
 * Build the two connection strings by taking MIGRATE_DB_URL and swapping the
 * user and password, then store them wherever your secrets live:
 *
 *   ADMIN_DATABASE_URL = postgresql://app_admin:<pw>@<same-host>/<same-db>?<same-params>
 *   DATABASE_URL       = postgresql://app_public:<pw>@<same-host>/<same-db>?<same-params>
 *
 * Then run `pnpm migrate`.
 */

/* --- ROTATION (later, as needed) --------------------------------------------
 * Unlike creation, ALTER ROLE works on a role that already has a password, so
 * rotation needs no downtime and no role recreation. Never recreate a role to
 * change its password: a new role gets a new OID, and Neon's pooler keeps
 * serving the old one until the compute endpoint is restarted, so pooled
 * connections fail with "invalid role OID" in the meantime.
 *
 * Same shape as Step 1, and for the same reason — the password is generated
 * inside the statement so it never lands in the SQL Editor's History. Swap the
 * role name as needed, then update the stored connection string.
 */

-- CREATE TABLE _rotate_pw AS
-- SELECT replace(gen_random_uuid()::text, '-', '') ||
--        replace(gen_random_uuid()::text, '-', '') AS pw;
--
-- DO $$
-- DECLARE p text;
-- BEGIN
--   SELECT pw INTO p FROM _rotate_pw;
--   EXECUTE format('ALTER ROLE app_public PASSWORD %L', p);
-- END $$;
--
-- SELECT pw AS new_password FROM _rotate_pw;   -- store it, then:
-- DROP TABLE _rotate_pw;
