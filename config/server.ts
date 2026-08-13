import "server-only";

/**
 * Server-only environment variables.
 *
 * Usage:
 * 1. Add the variable to `.env` / your secrets manager (e.g. Infisical).
 * 2. Add a typed field below using `requireEnv`.
 * 3. Import `serverConfig` in Server Components, Route Handlers, Server Actions,
 *    and `server/` domain code. Do not import this file from client components.
 */

function requireEnv(name: string): string {
  const raw = process.env[name]?.trim();
  if (!raw) throw new Error(`Missing required environment variable: ${name}`);

  return raw;
}

export const serverConfig = {
  adminDatabaseUrl: requireEnv("ADMIN_DATABASE_URL"),
  databaseUrl: requireEnv("DATABASE_URL"),
  neonAuthBaseUrl: requireEnv("NEON_AUTH_BASE_URL"),
  neonAuthCookieSecret: requireEnv("NEON_AUTH_COOKIE_SECRET"),
  raftAppName: requireEnv("RAFT_APP_NAME"),
  raftDatabaseUrl: requireEnv("RAFT_DATABASE_URL"),
  r2AccessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
  r2AccountId: requireEnv("R2_ACCOUNT_ID"),
  r2BucketName: requireEnv("R2_BUCKET_NAME"),
  r2SecretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
} as const;
