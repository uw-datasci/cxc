SET ROLE app_admin;

/* The table is intentionally removed only when this migration is rolled back.
 * Never run this against a database whose waitlist data must be retained. */
DROP FUNCTION IF EXISTS join_waitlist(text);
DROP TABLE IF EXISTS waitlist;

RESET ROLE;
