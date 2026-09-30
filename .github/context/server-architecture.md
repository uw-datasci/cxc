# Server & API Architecture — Reference for AI Agents

Read this before adding or changing API routes, Server Actions, data fetching in Server
Components, services, repositories, or database tables.

Related, more detailed references:

- `server/README.md` — the server folder spec, including the RLS rationale
- `.github/context/raft-reference.md` — the Raft SDK (`withRaft`, `RaftResponse`)
- `lib/auth/guard.ts` — `withAuth`, `requireUser`, `requireRole`, `getAuthContext`
- The `users` domain (`server/users/`) and `app/api/me/route.ts` — the working reference
  implementation

This doc is the canonical guide to how those pieces fit together. `AGENTS.md`,
`.github/copilot-instructions.md`, and `.cursor/rules/server-architecture.mdc` carry a
condensed cheat sheet of it — update them together.

---

## 1. The request path

Every server-side read or write follows the same path, and each layer only talks to the
one directly below it:

```
Entry point              app/api/**/route.ts · Server Action · Server Component
   │   authenticates:     withAuth(...)       · requireUser() / requireRole()
   ▼
Service                  server/{domain}/{domain}.service.ts
   │   business rules, validation, fallbacks, cross-domain orchestration
   ▼
Repository               server/{domain}/{domain}.repository.ts   (extends BaseRepository)
   │   SQL only; runs every query with app.user_id set
   ▼
Postgres (Neon)          Row-Level Security policies decide which rows are visible
```

- **The entry point knows HTTP and auth. The service knows the rules. The repository knows
  SQL.** Nothing skips a layer.
- **Code is organized by domain, not by layer.** `server/applications/` holds both the
  service and the repository. There are no top-level `services/` or `repositories/`
  folders; `server/shared/` is the only exception, and it holds infrastructure.
- **Identity is bound at construction.** Services and repositories take the caller's
  `userId` in their constructor, so no method can forget to scope itself.

### What each layer may do

| Layer | Owns | May import | Must not |
| --- | --- | --- | --- |
| Route handler (`app/api/**/route.ts`) | HTTP: parsing the request, choosing the status code, the response shape | `withAuth` / Raft, **services**, types | Import repositories or `@/config/db`; build `NextResponse` by hand; hold business rules |
| Server Action / Server Component | Auth gate, then calling services | `requireUser` / `requireRole`, **services** | Same as above |
| Service (`{domain}.service.ts`) | Use cases, validation, defaults and fallbacks, authorization decisions beyond RLS, mapping rows to DTOs | Its **own** repository, **other domains' services**, `lib/*`, types | Import another domain's repository; know about `Request` / `Response` / HTTP status |
| Repository (`{domain}.repository.ts`) | Parameterised SQL through `this.query` / `this.queryOne` / `this.transaction` | `BaseRepository`, row types | Contain business rules; be imported from outside its folder; use `sql` / `adminSql` directly |

These boundaries are enforced, not just conventional. An ESLint rule
(`eslint.config.mjs`) blocks `@/config/db` and `@/server/*/*.repository` from `app/`,
`components/`, and `lib/`. `"server-only"` keeps services and repositories out of client
bundles.

---

## 2. Naming

Follow the existing `users` domain:

| Thing | Pattern | Example |
| --- | --- | --- |
| Domain folder | plural noun | `server/applications/` |
| Repository file / class | `{domain}.repository.ts` / `{Domain}Repository` (plural) | `applications.repository.ts` / `ApplicationsRepository` |
| Service file / class | `{domain}.service.ts` / `{Entity}Service` (singular) | `applications.service.ts` / `ApplicationService` |
| Row types | `{Table}Row` interfaces, private to the repository file | `ApplicationRow` |
| Shared DTOs / types | `types/{entity}.ts` when the client or another domain needs them | `types/application.ts` |
| API route | `app/api/{resource}/route.ts`, `[id]/route.ts` for one item | `app/api/applications/[id]/route.ts` |
| Client fetchers | `lib/api/{resource}.ts` | `lib/api/applications.ts` |

---

## 3. Adding a domain, step by step

The worked example is a hacker `applications` domain. It is illustrative — adapt the names
and columns.

### 3.1 Migration: table, RLS, and policies together

```bash
pnpm migrate:create add-applications   # creates the .js wrapper plus -up.sql / -down.sql files
```

```sql
-- migrations/sqls/<timestamp>-add-applications-up.sql
CREATE TABLE application (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL,
  status     text NOT NULL DEFAULT 'submitted',
  essay      text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE application ENABLE ROW LEVEL SECURITY;

CREATE POLICY application_read ON application
  FOR SELECT TO app_public
  USING (
    user_id = (SELECT app_current_user_id())
    OR (SELECT app_current_role()) = 'organizer'
  );

CREATE POLICY application_insert ON application
  FOR INSERT TO app_public
  WITH CHECK (user_id = (SELECT app_current_user_id()));
```

> **Every new table must `ENABLE ROW LEVEL SECURITY` and define its policies in the same
> migration.** Default privileges give `app_public` full `SELECT/INSERT/UPDATE/DELETE` on
> new tables. A table without RLS is readable and writable by *every* signed-in user.
> Grant only the operations the feature needs: no policy means that operation is denied.

Wrap `app_current_user_id()` and `app_current_role()` in `(SELECT …)` as shown, so Postgres
evaluates them once per statement. Mirror
`migrations/sqls/20260812031828-rls-policies-up.sql`. Write the matching `-down.sql`.

### 3.2 Repository — SQL only

```ts
// server/applications/applications.repository.ts
import "server-only";

import { BaseRepository } from "@/server/shared/base.repository";

/** Row shape of `application`. */
interface ApplicationRow {
  id: string;
  user_id: string;
  status: string;
  essay: string;
  created_at: Date;
}

/**
 * Data access for the applications domain. Internal to this folder — the app layer goes
 * through `applications.service.ts`. RLS scopes every query to the bound user.
 */
export class ApplicationsRepository extends BaseRepository {
  constructor(userId: string) {
    super(userId);
  }

  async findLatest(): Promise<ApplicationRow | null> {
    return this.queryOne<ApplicationRow>(
      (txn) => txn`
        select id, user_id, status, essay, created_at
        from application
        where user_id = ${this.userId}::uuid
        order by created_at desc
        limit 1`
    );
  }

  /** By id. RLS lets organizers read anyone's row, so no user predicate here. */
  async findById(id: string): Promise<ApplicationRow | null> {
    return this.queryOne<ApplicationRow>(
      (txn) => txn`
        select id, user_id, status, essay, created_at
        from application
        where id = ${id}::uuid`
    );
  }

  async insert(essay: string): Promise<ApplicationRow | null> {
    return this.queryOne<ApplicationRow>(
      (txn) => txn`
        insert into application (user_id, essay)
        values (${this.userId}::uuid, ${essay})
        returning id, user_id, status, essay, created_at`
    );
  }
}
```

- Always use the tagged template (`txn\`… ${value}\``). It parameterises values. Never
  build SQL with string concatenation.
- Use `this.transaction((txn) => [q1, q2])` when several statements must commit together.
- Return raw rows or primitives. Deciding what `null` *means* is the service's job.

### 3.3 Service — the rules

```ts
// server/applications/applications.service.ts
import "server-only";

import type { Application } from "@/types/application";
import { ApplicationsRepository } from "./applications.repository";

const MIN_ESSAY_LENGTH = 100;

export type SubmitResult =
  | { ok: true; application: Application }
  | { ok: false; reason: "already_submitted" | "essay_too_short" };

/** Business logic for the applications domain — the entry point the app layer uses. */
export class ApplicationService {
  private readonly repository: ApplicationsRepository;

  constructor(private readonly userId: string) {
    this.repository = new ApplicationsRepository(userId);
  }

  /** The caller's application, or `null` if they have not applied. */
  async getMine(): Promise<Application | null> {
    const row = await this.repository.findLatest();
    return row && toApplication(row);
  }

  /** One application by id, or `null` if it doesn't exist or RLS hides it. */
  async getById(id: string): Promise<Application | null> {
    const row = await this.repository.findById(id);
    return row && toApplication(row);
  }

  async submit(input: { essay: string }): Promise<SubmitResult> {
    const essay = input.essay.trim();
    if (essay.length < MIN_ESSAY_LENGTH) return { ok: false, reason: "essay_too_short" };
    if (await this.repository.findLatest()) return { ok: false, reason: "already_submitted" };

    const row = await this.repository.insert(essay);
    if (!row) throw new Error("Insert returned no row"); // unexpected → 500 + quarantine
    return { ok: true, application: toApplication(row) };
  }
}

function toApplication(row: {
  id: string;
  status: string;
  essay: string;
  created_at: Date;
}): Application {
  return { id: row.id, status: row.status, essay: row.essay, submittedAt: row.created_at };
}
```

```ts
// types/application.ts — shared with the client, so it lives in types/
export interface Application {
  id: string;
  status: string;
  essay: string;
  submittedAt: Date;
}
```

#### Errors: return expected outcomes, throw only unexpected ones

`withRaft` (which `withAuth` applies) turns **any** thrown error into a quarantined **500**.
Throwing `ApiError("…", 400)` still produces a 500. So:

- **Expected outcomes** — not found, invalid input, a business rule said no — are
  **returned**: `null` for "absent", or a discriminated union like `SubmitResult` above.
  The entry point maps them to `RaftResponse.notFound()` / `.badRequest()` / `.forbidden()`.
- **Unexpected failures** — a broken invariant, the database being down — are **thrown**.
  Let them propagate. Don't wrap handlers in `try/catch`.

### 3.4 Route handler — HTTP only

```ts
// app/api/applications/route.ts
import { RaftResponse } from "@uw-datasci/raft";

import { withAuth } from "@/lib/auth/guard";
import { ApplicationService } from "@/server/applications/applications.service";

export const GET = withAuth(async (_request, _context, auth) => {
  const application = await new ApplicationService(auth.userId).getMine();
  if (!application) return RaftResponse.notFound("No application yet");
  return RaftResponse.ok(application);
});

export const POST = withAuth(async (request, _context, auth) => {
  const body = await request.json().catch(() => null);
  if (typeof body?.essay !== "string") return RaftResponse.badRequest("essay is required");

  const result = await new ApplicationService(auth.userId).submit({ essay: body.essay });
  if (!result.ok) return RaftResponse.badRequest(result.reason);

  return RaftResponse.json(result.application, 201);
});
```

Dynamic segments, and restricting a route to certain roles:

```ts
// app/api/applications/[id]/route.ts
type Params = { id: string }; // a type alias, not an interface — see lib/auth/guard.ts

export const GET = withAuth<Params>(
  async (_request, { params }, auth) => {
    const { id } = await params; // Next 16: params is a Promise
    const application = await new ApplicationService(auth.userId).getById(id);
    if (!application) return RaftResponse.notFound();
    return RaftResponse.ok(application);
  },
  { roles: ["organizer"] }
);
```

Route rules:

- **Guarded routes use `withAuth`.**
  - A signed-out caller gets 401.
  - An unverified caller gets 403. Opt out with `allowUnverified`.
  - A caller with the wrong role gets 404, which hides that the route exists.
- **Public routes wrap themselves in `withRaft`.** Never export an unwrapped handler.
- **Respond only through `RaftResponse.*`.** `serverError` is async — `await` it.
- **Validate the request shape** (types, required fields) in the route. **Business rules**
  go in the service.
- **Use `auth` from `withAuth`.** Never re-read the session, and never trust a `userId` from
  the body or query string. Services are constructed with `auth.userId`.

### 3.5 Server Components and Server Actions

These use the same services. They authenticate with the redirecting guards instead of
`withAuth`:

```tsx
// app/apply/page.tsx — Server Component
import { requireUser } from "@/lib/auth/guard";
import { ApplicationService } from "@/server/applications/applications.service";

export default async function ApplyPage() {
  const auth = await requireUser(); // redirects to /sign-in or /verify-email
  const application = await new ApplicationService(auth.userId).getMine();
  // render…
}
```

```ts
// app/apply/actions.ts — Server Action, colocated with the route that uses it
"use server";

import { requireUser } from "@/lib/auth/guard";
import { ApplicationService } from "@/server/applications/applications.service";

export async function submitApplication(formData: FormData) {
  const auth = await requireUser();
  const essay = formData.get("essay");
  if (typeof essay !== "string") return { ok: false as const, reason: "essay_required" };
  return new ApplicationService(auth.userId).submit({ essay });
}
```

- Use `requireRole("organizer")` for organizer-only pages. It returns a 404 to everyone
  else.
- Use `getAuthContext()` only for pages that must work for signed-out or unverified users,
  such as `/verify-email`.
- **Prefer Server Components and Server Actions for the app's own pages.** Add an
  `app/api` route when a client component must fetch or mutate after load, or when
  something outside the app calls it.

### 3.6 Client components

Client components never import services. They call an API route through a small typed
fetcher in `lib/api/`:

```ts
// lib/api/applications.ts
import type { Application } from "@/types/application";

export async function fetchMyApplication(): Promise<Application | null> {
  const res = await fetch("/api/applications");
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load application (${res.status})`);
  return res.json();
}
```

---

## 4. Cross-domain work and privileged operations

- **Cross-domain:** a service may construct and call another domain's *service*, never its
  repository. For example, `ApplicationService` may use `new UserService(this.userId)`.
- **Privileged writes** (acting on other users' rows, role changes) are not done with
  `adminSql` — ESLint blocks it in the app layer. Add a `SECURITY DEFINER` function in a
  migration that checks the caller's authority itself, grant `EXECUTE` to `app_public`,
  and call it from a repository. `grant_user_role()` in the rls-policies migration is the
  model.
- **Organizer reads across users** belong in RLS (`OR (SELECT app_current_role()) =
  'organizer'`), not in the app layer.

---

## 5. Self-check before you finish

1. New tables: RLS is enabled, a policy exists for each operation used, and the
   `-down.sql` is written.
2. Repositories extend `BaseRepository`, start with `import "server-only"`, use only tagged
   templates, and hold no business rules.
3. Services take `userId` in the constructor, keep their repository `private`, and only
   touch other domains through their services.
4. Expected outcomes are returned (`null` / result unions) and mapped to 4xx; nothing
   throws for a 4xx.
5. Every route is wrapped in `withAuth` or `withRaft` and responds only via
   `RaftResponse.*`.
6. Route `params` use a `type` alias and are `await`ed.
7. `pnpm lint` passes. The restricted-import rule catches layer violations.
