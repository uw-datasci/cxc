/* Restore app_public to its previous (over-privileged) state.
 *
 * This is a genuine rollback of the migration, not a recommendation — the
 * prior state let app_public bypass RLS and read/write every table. Only run
 * this if a deploy has to be reverted to a commit that predates the
 * least-privilege model.
 */

GRANT neon_superuser TO app_public;

ALTER ROLE app_public
  BYPASSRLS
  CREATEDB
  CREATEROLE;

GRANT USAGE ON SCHEMA public TO app_public;
