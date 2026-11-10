SET ROLE app_admin;

/* Drops every application. Never run this against a database whose data must be kept. */
DROP TABLE IF EXISTS application;

RESET ROLE;
