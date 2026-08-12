import "server-only";

import { neon } from "@neondatabase/serverless";
import { serverConfig } from "./server";

/**
 * Neon serverless SQL client for the request path.
 *
 * Backed by `DATABASE_URL`, which connects as the `app_public` Postgres role:
 * DML on application tables only, no RLS bypass, no write access to
 * `user_role`. Do not use this export directly — go through a domain service
 * (`server/<domain>/<domain>.service.ts`), whose repository extends
 * `BaseRepository` and sets the `app.user_id` session variable that RLS
 * policies key on. A query issued without it returns zero rows.
 */
export const sql = neon(serverConfig.databaseUrl);

/**
 * Privileged client connecting as `app_admin` (the table owner).
 *
 * Bypasses RLS and every grant. Reserved for migrations, the bootstrap role
 * grant, and background jobs that legitimately act outside any user's session.
 *
 * NEVER import this from a request path — an ESLint `no-restricted-imports`
 * rule blocks it outside `server/` and `scripts/`. If you find yourself
 * wanting it in a route handler, the answer is almost always a SECURITY
 * DEFINER function (see `grant_user_role`) instead.
 */
export const adminSql = neon(serverConfig.adminDatabaseUrl);
