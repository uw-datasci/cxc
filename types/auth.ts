import type { Role } from "@/lib/auth/roles";

/**
 * The authenticated caller, as resolved once per request by
 * `getAuthContext()` in `lib/auth/guard.ts`.
 *
 * Identity comes from Neon Auth; `role` comes from our own `user_role` table,
 * because Neon's Managed Better Auth does not support custom JWT claims.
 */
export interface AuthContext {
  userId: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  role: Role;
}
