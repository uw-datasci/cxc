SET ROLE app_admin;

/* The email is the natural key: accounts do not exist at this stage. The
 * conditional create also lets this migration adopt the table created during
 * initial development without replacing any existing rows. */
CREATE TABLE IF NOT EXISTS waitlist (
  email      text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

/* The public request role must not access subscriber data directly. With no
 * table policies, RLS denies direct DML; these explicit revokes also protect
 * the table from the repository's broad default table privileges. */
REVOKE ALL ON TABLE waitlist FROM PUBLIC;
REVOKE ALL ON TABLE waitlist FROM app_public;

CREATE OR REPLACE FUNCTION join_waitlist(input_email text) RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public, pg_temp
AS $$
BEGIN
  /* FOUND is true only when this statement inserts a new address. */
  INSERT INTO waitlist (email)
  VALUES (input_email)
  ON CONFLICT (email) DO NOTHING;

  RETURN FOUND;
END
$$;

REVOKE ALL ON FUNCTION join_waitlist(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION join_waitlist(text) TO app_public;

RESET ROLE;
