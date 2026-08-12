# Server

This folder holds server-side business logic and data access. Organize code by **domain** (feature or bounded context), not by technical layer.

## Directory layout

Each domain gets its own folder. Inside that folder, keep a **service** (business logic) and a **repository** (database / external data access):

```
server/
├── shared/
│   └── base.repository.ts     # infrastructure every domain extends
├── users/
│   ├── users.service.ts
│   └── users.repository.ts
├── products/
│   ├── products.service.ts
│   └── products.repository.ts
└── orders/
    ├── orders.service.ts
    └── orders.repository.ts
```

Add new domains by creating a folder and the two files above.

`shared/` is the one folder that is **not** a domain. It holds infrastructure the domains build on — currently `base.repository.ts`. Keep it small: anything that belongs to a feature belongs in that feature's folder instead.

## Naming conventions

| File | Pattern | Example |
|------|---------|---------|
| Service | `{domain}.service.ts` | `users/users.service.ts` |
| Repository | `{domain}.repository.ts` | `users/users.repository.ts` |
| Folder | Singular or plural domain name (pick one and stay consistent) | `users/` or `user/` |

## Responsibilities

### `{domain}.repository.ts`

- Talks to the database, ORM, or other persistence/API layer.
- Extends `BaseRepository` from `server/shared/base.repository.ts`.
- Exposes narrow data operations: `findById`, `create`, `update`, `delete`, queries.
- No business rules, validation beyond data shape, or orchestration across domains.
- Returns domain records or primitives; avoid leaking framework types when possible.

### `{domain}.service.ts`

- A class, bound to a single `userId`, that constructs and privately holds its repository.
- Implements business logic and use cases for that domain.
- Calls its own repository (and optionally other domains' **services**, not their repositories).
- Handles validation, authorization checks, transactions, and mapping to DTOs.
- What API routes, Server Actions, and Server Components should call.

## Data access and RLS

`BaseRepository` is constructed bound to a single `userId`, and every query it runs sets the `app.user_id` session variable that the Row-Level Security policies key on. Binding at construction rather than per call means no method can forget to scope itself.

This is enforced two ways. In Postgres, a query without `app.user_id` set matches no rows — RLS fails closed. In the toolchain, an ESLint rule blocks `@/config/db` and `@/server/*/*.repository` from `app/`, `components/`, `lib/`, `hooks/`, `contexts/`, and `providers/`, so the app layer cannot reach past a service to the database.

A consequence worth internalising: inside a repository, `where user_id = …` is belt-and-braces. The policy is what keeps other users' rows out, so forgetting the predicate is not a data leak.

## Example

```ts
// server/users/users.repository.ts
import { BaseRepository } from "@/server/shared/base.repository";

export class UsersRepository extends BaseRepository {
  constructor(userId: string) {
    super(userId);
  }

  async findRole(): Promise<string | null> {
    const row = await this.queryOne<{ role: string }>(
      (txn) => txn`select role from user_role where user_id = ${this.userId}::uuid`
    );
    return row?.role ?? null;
  }
}

// server/users/users.service.ts
import { DEFAULT_ROLE, isRole, type Role } from "@/lib/auth/roles";
import { UsersRepository } from "./users.repository";

export class UserService {
  private readonly repository: UsersRepository;

  constructor(private readonly userId: string) {
    this.repository = new UsersRepository(userId);
  }

  async getRole(): Promise<Role> {
    const role = await this.repository.findRole();
    return isRole(role) ? role : DEFAULT_ROLE; // fail closed on unknown values
  }
}
```

Note the split: the repository returns the raw `string | null`, and the service decides what an absent or unrecognised value means. The service constructs its own repository and keeps it private, so the data layer is unreachable from outside the domain.

## Usage from the app

Import services (not repositories) from route handlers, Server Actions, and Server Components:

```ts
import { UserService } from "@/server/users/users.service";

const role = await new UserService(userId).getRole();
```

Keep repositories internal to their domain folder.

## Guidelines

- One domain per folder; do not split services and repositories into top-level `services/` and `repositories/` trees. `shared/` is the sole exception, for infrastructure.
- Cross-domain work: depend on another domain's **service**, not its repository.
- Repositories extend `BaseRepository`; do not query `@/config/db` directly.
- Shared types belong in `types/` at the project root; domain-only types can live next to the domain files if small.
- Server configuration and env wiring live in `config/`, not inside domain folders.
