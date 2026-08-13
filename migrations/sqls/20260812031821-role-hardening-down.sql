/* Withdraw the privileges granted by the up migration.
 *
 * The roles themselves are deliberately left in place: they are provisioned
 * outside the migration set (scripts/bootstrap-roles.sql), so dropping them
 * here would destroy state this migration never created, and would invalidate
 * the stored connection strings.
 *
 * Leaving them also avoids a sharp edge — dropping and recreating a role
 * changes its OID, and Neon's pooler keeps serving the old one, so pooled
 * connections fail with "invalid role OID" until the compute endpoint is
 * restarted. A rollback should not take the app offline.
 */

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_public;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM app_public;
REVOKE ALL ON SCHEMA public FROM app_public;
REVOKE ALL ON SCHEMA public FROM app_admin;

/* The default privileges granted FOR ROLE app_admin are revoked by the
 * auth-schema down migration, which db-migrate always runs before this one and
 * which does so under SET ROLE app_admin. Repeating them here would fail with
 * "permission denied to change default privileges": altering another role's
 * defaults requires holding that role's privileges, and neondb_owner's
 * membership in app_admin is deliberately INHERIT FALSE. */

/* Restore the default the up migration revoked. */
GRANT USAGE ON SCHEMA public TO PUBLIC;

/* The app_admin -> neondb_owner SET grant is left in place. Re-granting it in
 * the up migration is idempotent, and revoking it here would strand any
 * concurrent session that had already assumed the role. */
