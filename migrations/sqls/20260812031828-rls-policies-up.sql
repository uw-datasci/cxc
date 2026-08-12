/* Row-level security via a session variable, on direct connections.
 *
 * No Data API and no pg_session_jwt. That extension only exists to carry an
 * identity into the session, and Neon now installs it only when the Data API
 * is enabled — where, on a direct connection, it falls back to reading
 * request.jwt.claims, "a regular Postgres parameter that can be modified by
 * any database user". A stock session variable has exactly the same trust
 * model with none of the coupling, so we use that.
 *
 * The repository layer sets app.user_id from a server-verified session; see
 * asUser() in server/repositories/db.ts.
 *
 * WHAT THIS BUYS: a forgotten `where user_id = $1` is silently constrained by
 * the policy instead of returning every row. That is the realistic, recurring
 * bug this is here to stop.
 *
 * WHAT IT DOES NOT: a compromised app process could set app.user_id to any
 * value. Only JWKS-validated RLS defends against that, and Neon now offers
 * that path solely through the Data API.
 */

/* Identity of the current request. Returns NULL when unset, so every policy
 * below evaluates to NULL -> no rows. Fail-closed by construction. */
CREATE FUNCTION app_current_user_id() RETURNS uuid
  LANGUAGE sql
  STABLE
  SET search_path = public, pg_temp
AS $$
  SELECT nullif(current_setting('app.user_id', true), '')::uuid
$$;

/* Authority of the current request, resolved in the database rather than
 * asserted by the app: the caller supplies only an identity, and the role is
 * looked up here. SECURITY DEFINER so that reading user_role from inside a
 * policy ON user_role does not recurse. */
CREATE FUNCTION app_current_role() RETURNS text
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public, pg_temp
AS $$
  SELECT coalesce(
    (SELECT role FROM user_role WHERE user_id = app_current_user_id()),
    'user'
  )
$$;

REVOKE ALL ON FUNCTION app_current_user_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION app_current_role()    FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_current_user_id() TO app_public;
GRANT EXECUTE ON FUNCTION app_current_role()    TO app_public;

/* ---------------------------------------------------------------------------
 * Policies.
 *
 * current_setting/function calls are wrapped in (SELECT ...) so Postgres
 * hoists them into an InitPlan — evaluated once per statement rather than once
 * per row. On a large scan the difference is dramatic.
 *
 * RLS is ENABLE'd but not FORCE'd: app_admin must stay able to run migrations,
 * the bootstrap grant, and the SECURITY DEFINER functions above. The guard
 * against app_admin leaking into a request path is the ESLint rule on
 * adminSql, not FORCE.
 * ------------------------------------------------------------------------ */

ALTER TABLE user_role ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_role_read ON user_role
  FOR SELECT TO app_public
  USING (
    user_id = (SELECT app_current_user_id())
    OR (SELECT app_current_role()) = 'organizer'
  );

/* No INSERT/UPDATE/DELETE policy: app_public has no write privilege on this
 * table at all (see auth-schema migration). Role changes go exclusively
 * through grant_user_role() below. */

ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_profile_read ON user_profile
  FOR SELECT TO app_public
  USING (
    user_id = (SELECT app_current_user_id())
    OR (SELECT app_current_role()) = 'organizer'
  );

CREATE POLICY user_profile_insert ON user_profile
  FOR INSERT TO app_public
  WITH CHECK (user_id = (SELECT app_current_user_id()));

CREATE POLICY user_profile_update ON user_profile
  FOR UPDATE TO app_public
  USING      (user_id = (SELECT app_current_user_id()))
  WITH CHECK (user_id = (SELECT app_current_user_id()));

ALTER TABLE role_change_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY role_change_log_read ON role_change_log
  FOR SELECT TO app_public
  USING ((SELECT app_current_role()) = 'organizer');

/* app_role is a public lookup table (the role list itself is not sensitive),
 * so it carries no RLS — only the SELECT grant from the auth-schema migration. */

/* ---------------------------------------------------------------------------
 * The one controlled write path for roles.
 *
 * app_public cannot write user_role directly. This function, owned by
 * app_admin, performs the write with owner privileges but only in this exact
 * shape: caller must be an organizer, the target role must exist, the change
 * is always audited, and nobody can change their own role.
 * ------------------------------------------------------------------------ */
CREATE FUNCTION grant_user_role(target uuid, new_role text) RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public, pg_temp
AS $$
DECLARE
  caller      uuid := app_current_user_id();
  caller_role text := app_current_role();
  previous    text;
BEGIN
  IF caller IS NULL THEN
    RAISE EXCEPTION 'no authenticated session';
  END IF;

  IF caller_role <> 'organizer' THEN
    RAISE EXCEPTION 'insufficient privileges to change roles';
  END IF;

  /* Prevents an organizer from demoting themselves into a lockout, and stops
     any self-escalation path from ever existing. */
  IF target = caller THEN
    RAISE EXCEPTION 'cannot change your own role';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM app_role WHERE key = new_role) THEN
    RAISE EXCEPTION 'unknown role %', new_role;
  END IF;

  SELECT role INTO previous FROM user_role WHERE user_id = target;

  INSERT INTO user_role (user_id, role, granted_by)
  VALUES (target, new_role, caller)
  ON CONFLICT (user_id) DO UPDATE
    SET role = excluded.role, granted_by = excluded.granted_by, granted_at = now();

  INSERT INTO role_change_log (target_user, old_role, new_role, changed_by)
  VALUES (target, previous, new_role, caller);
END
$$;

REVOKE ALL ON FUNCTION grant_user_role(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION grant_user_role(uuid, text) TO app_public;
