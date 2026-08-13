/* Privilege structure for the application roles.
 *
 * The roles themselves are created once by scripts/bootstrap-roles.sql, run in
 * the Neon SQL Editor — see that file for why they cannot be created from the
 * Neon Roles tab, and why the password cannot be deferred. This migration only
 * grants; it never creates a role and never handles a credential.
 *
 * An earlier version of this migration tried to strip privileges off roles that
 * already existed, starting with `REVOKE neon_superuser FROM app_public`. That
 * is impossible on Neon: those grants come from `cloud_admin` with
 * admin_option = false, and Postgres 16+ requires ADMIN OPTION to revoke a role
 * membership. Verified against this database 2026-08-12 — ALTER ROLE, DROP
 * ROLE, and even CONNECTION LIMIT are refused too.
 *
 * A trap worth recording: `REVOKE pg_read_all_data FROM app_public` *succeeds*
 * as a no-op, because that access is inherited via neon_superuser rather than
 * granted directly, and Postgres allows revoking a grant that does not exist.
 * Working around the original error that way would have produced a green
 * migration against a role that still read and wrote every table.
 */

/* Fail with an actionable message rather than letting a missing role surface as
 * an opaque "role app_admin does not exist" three migrations later. */
DO $$
DECLARE
  missing text;
BEGIN
  SELECT string_agg(r, ', ') INTO missing
  FROM   unnest(ARRAY['app_admin', 'app_public']) AS r
  WHERE  NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r);

  IF missing IS NOT NULL THEN
    RAISE EXCEPTION
      'Missing database role(s): %. Run scripts/bootstrap-roles.sql in the Neon SQL Editor first.', missing
      USING HINT = 'Roles are provisioned once, outside migrations, so no password is ever passed to pnpm migrate.';
  END IF;
END $$;

/* app_public gets USAGE and nothing more; object-level DML is granted
 * explicitly in the auth-schema migration. app_admin owns the objects, so it
 * needs CREATE. Neither is a member of the other. */
REVOKE ALL ON SCHEMA public FROM PUBLIC;

GRANT USAGE          ON SCHEMA public TO app_public;
GRANT USAGE, CREATE  ON SCHEMA public TO app_admin;

/* Migrations connect as neondb_owner but must create objects *as* app_admin so
 * that ownership — and `ALTER DEFAULT PRIVILEGES FOR ROLE app_admin` in the
 * auth-schema migration — behave as documented.
 *
 * Postgres 16+ automatically grants the creating role membership in the new
 * role, but on Neon that automatic grant arrives rewritten by the control plane
 * — grantor cloud_admin, admin_option true, set_option FALSE — so neondb_owner
 * cannot actually SET ROLE app_admin without help:
 *
 *   role       member        admin_option  inherit_option  set_option  grantor
 *   app_admin  neondb_owner  true          false           false       cloud_admin
 *
 * The ADMIN OPTION it does carry is enough to grant itself the missing SET.
 * Note the shape carefully: re-granting ADMIN here fails outright with "ADMIN
 * option cannot be granted back to your own grantor", and INHERIT is left off
 * deliberately so neondb_owner must opt in via SET ROLE rather than silently
 * absorbing app_admin's privileges into every session. */
GRANT app_admin TO neondb_owner WITH SET TRUE, INHERIT FALSE;

/* Neon Auth owns its schema (owner: neon_auth) and manages its own grants. The
 * request path never queries it directly — identity comes from the SDK over
 * HTTP, and user_id is joined against our own tables. Make sure app_public has
 * no path to credential material in neon_auth.account. */
REVOKE ALL ON ALL TABLES IN SCHEMA neon_auth FROM app_public;
REVOKE ALL ON SCHEMA neon_auth FROM app_public;
