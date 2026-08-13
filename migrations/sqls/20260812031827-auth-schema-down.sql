/* These objects are owned by app_admin, and the migration connects as
 * neondb_owner whose membership in app_admin is INHERIT FALSE — so the owner
 * privileges have to be assumed explicitly, exactly as in the up migration. */
SET ROLE app_admin;

ALTER DEFAULT PRIVILEGES FOR ROLE app_admin IN SCHEMA public
  REVOKE USAGE, SELECT ON SEQUENCES FROM app_public;

ALTER DEFAULT PRIVILEGES FOR ROLE app_admin IN SCHEMA public
  REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM app_public;

DROP TABLE IF EXISTS role_change_log;
DROP TABLE IF EXISTS user_profile;
DROP TABLE IF EXISTS user_role;
DROP TABLE IF EXISTS app_role;

RESET ROLE;
