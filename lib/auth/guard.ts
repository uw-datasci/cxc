import "server-only";

import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { RaftResponse, withRaft } from "@uw-datasci/raft";

import { UserService } from "@/server/users/users.service";
import type { AuthContext } from "@/types/auth";
import type { Role } from "./roles";
import { auth } from "./server";

const SIGN_IN_PATH = "/sign-in";

/**
 * Resolves the current caller: identity from Neon Auth, role from `user_role`.
 *
 * Wrapped in React `cache()` so it runs at most once per request no matter how
 * many components or helpers ask for it. The session read is usually served
 * from the SDK's signed cookie cache, so the only real cost is one indexed
 * primary-key lookup against a database we are already querying.
 *
 * Returns `null` when there is no session — callers decide what that means.
 */
export const getAuthContext = cache(async (): Promise<AuthContext | null> => {
  const { data: session } = await auth.getSession();
  const user = session?.user;
  if (!user) return null;

  return {
    userId: user.id,
    email: user.email,
    name: user.name ?? null,
    emailVerified: Boolean(user.emailVerified),
    role: await new UserService(user.id).getRole(),
  };
});

/**
 * Requires an authenticated caller, redirecting to sign-in otherwise.
 *
 * For Server Components and Server Actions. Route handlers should use
 * {@link withAuth}, which returns a 401 rather than a redirect.
 */
export async function requireUser(): Promise<AuthContext> {
  const ctx = await getAuthContext();
  if (!ctx) redirect(SIGN_IN_PATH);
  return ctx;
}

/**
 * Requires an authenticated caller holding one of `roles`.
 *
 * A caller with the wrong role gets a 404, not a 403: confirming that a page
 * exists but is off-limits leaks the shape of the organizer surface to anyone
 * probing for it.
 */
export async function requireRole(...roles: Role[]): Promise<AuthContext> {
  const ctx = await requireUser();
  if (!roles.includes(ctx.role)) notFound();
  return ctx;
}

/**
 * Route segment params, in the shape `withRaft` constrains its context to.
 *
 * Declare a route's params as a **type alias**, not an `interface` —
 * `type Params = { id: string }` picks up an implicit index signature and
 * satisfies this, whereas an equivalent `interface` does not and will not
 * compile.
 */
type RouteParams = Record<string, string | string[]>;

type RouteContext<TParams extends RouteParams = RouteParams> = {
  params: Promise<TParams>;
};

type RouteHandler<TParams extends RouteParams> = (
  request: Request,
  context: RouteContext<TParams>,
  auth: AuthContext
) => Response | Promise<Response>;

/**
 * Wraps a route handler so authorization — and error quarantine — are enforced
 * at the export site.
 *
 * Putting the check here rather than inside the handler body makes it visible
 * where the route is declared and greppable across the codebase — you can see
 * at a glance whether a route is guarded.
 *
 * The resolved {@link AuthContext} is passed as the third argument, so the
 * handler never needs to look the caller up again.
 *
 * @example
 * type Params = { id: string };
 * async function handler(_req: Request, { params }: RouteContext<Params>, auth: AuthContext) {
 *   return RaftResponse.ok(await findApplication(auth, (await params).id));
 * }
 * export const GET = withAuth(handler, { roles: ["organizer"] });
 */
export function withAuth<TParams extends RouteParams = Record<string, string>>(
  handler: RouteHandler<TParams>,
  options?: { roles?: readonly Role[] }
) {
  return withRaft<RouteContext<TParams>>(async (request, context) => {
    const ctx = await getAuthContext();

    if (!ctx) return RaftResponse.unauthorized();

    if (options?.roles && !options.roles.includes(ctx.role)) return RaftResponse.notFound();

    return handler(request, context, ctx);
  });
}
