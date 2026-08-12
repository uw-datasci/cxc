/**
 * The application's role list.
 *
 * Mirrored by the `app_role` table (see the auth-schema migration), which is
 * what `user_role.role` is foreign-keyed against. To add a role: add it here,
 * then `INSERT` it into `app_role` — no schema migration needed, because the
 * role list is data rather than an enum type.
 *
 * Keep the two in sync. A role present here but missing from `app_role` cannot
 * be granted; a role in `app_role` but missing here is invisible to the type
 * system and will not satisfy any guard.
 */
export const ROLES = ["user", "hacker", "volunteer", "organizer"] as const;

export type Role = (typeof ROLES)[number];

/** Role assigned when a user has no `user_role` row — every new sign-up. */
export const DEFAULT_ROLE: Role = "user";

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}
