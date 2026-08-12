import type { AuthContext } from "@/types/auth";
import { withAuth } from "@/lib/auth/guard";

/**
 * Reference implementation of a guarded route handler.
 *
 * `withAuth` resolves the caller once and hands the context to the handler, so
 * there is no second lookup. Add `{ roles: [...] }` to restrict further.
 */
async function handler(_request: Request, _context: unknown, auth: AuthContext) {
  return Response.json({
    userId: auth.userId,
    email: auth.email,
    name: auth.name,
    role: auth.role,
  });
}

export const GET = withAuth(handler);
