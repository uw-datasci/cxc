import { RaftResponse } from "@uw-datasci/raft";

import { withAuth } from "@/lib/auth/guard";

/**
 * Reference implementation of a guarded route handler. `withAuth` resolves the
 * caller once and hands the context to the handler, so there is no second lookup.
 * Add `{ roles: [...] }` to restrict further.
 */
export const GET = withAuth((_request, _context, auth) =>
  RaftResponse.ok({
    userId: auth.userId,
    email: auth.email,
    name: auth.name,
    role: auth.role,
  })
);
