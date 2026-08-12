/* Strip app_public down to a genuine least-privilege request-path role.
 *
 * WHY: app_public was created through the Neon Console, which grants
 * neon_superuser to every role it creates. That membership carries
 * pg_read_all_data and pg_write_all_data, and the role additionally had
 * BYPASSRLS, CREATEROLE and CREATEDB set directly. Verified 2026-08-11:
 *
 *   rolname     rolsuper  rolbypassrls  rolcreaterole  rolcreatedb
 *   app_public  false     true          true           true
 *   pg_has_role('app_public','pg_read_all_data','usage')  = true
 *   pg_has_role('app_public','pg_write_all_data','usage') = true
 *
 * Until this runs, every GRANT/REVOKE and every RLS policy in later
 * migrations is inert for app_public: it reads and writes every table
 * regardless, and BYPASSRLS skips policy evaluation entirely.
 *
 * NOTE: this migration must run as app_admin (ADMIN_DATABASE_URL), which is
 * why database.json points at that variable. ALTER ROLE ... NOBYPASSRLS
 * normally requires superuser; app_admin is not a superuser, only a member of
 * neon_superuser. If Neon rejects these statements, the fallback is to create
 * a fresh restricted role with SQL (roles created via SQL are NOT granted
 * neon_superuser, unlike Console/CLI/API-created ones) and repoint
 * DATABASE_URL at it. Failing loudly here is intentional.
 */

REVOKE neon_superuser FROM app_public;

ALTER ROLE app_public
  NOBYPASSRLS
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;

/* app_public keeps only what the request path needs. Object-level grants for
 * application tables are issued in the auth-schema migration; these are the
 * baseline schema-level rights. */
REVOKE ALL ON SCHEMA public FROM app_public;
GRANT USAGE ON SCHEMA public TO app_public;

/* Neon Auth owns its schema (owner: neon_auth) and manages its own grants.
 * The request path never queries it directly — identity comes from the SDK
 * over HTTP, and user_id is joined against our own tables. Explicitly ensure
 * app_public has no access to credential material in neon_auth.account. */
REVOKE ALL ON ALL TABLES IN SCHEMA neon_auth FROM app_public;
REVOKE ALL ON SCHEMA neon_auth FROM app_public;
