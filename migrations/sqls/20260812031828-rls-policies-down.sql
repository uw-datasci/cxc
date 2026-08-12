DROP FUNCTION IF EXISTS grant_user_role(uuid, text);

DROP POLICY IF EXISTS role_change_log_read ON role_change_log;
ALTER TABLE role_change_log DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_profile_update ON user_profile;
DROP POLICY IF EXISTS user_profile_insert ON user_profile;
DROP POLICY IF EXISTS user_profile_read   ON user_profile;
ALTER TABLE user_profile DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_role_read ON user_role;
ALTER TABLE user_role DISABLE ROW LEVEL SECURITY;

DROP FUNCTION IF EXISTS app_current_role();
DROP FUNCTION IF EXISTS app_current_user_id();
