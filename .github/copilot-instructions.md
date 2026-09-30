# Copilot Instructions - Design System & Repository Organization

## Overview
This repository uses Next.js 16 with the App Router, shadcn/ui, Tailwind CSS v4, the CxC design system, and a structured file organization pattern. There is no `src/` directory; everything sits at the repo root. Follow these guidelines when generating or modifying files.

## Design System

**Before creating or editing any page, component, or style, read `.github/context/design-system.md`.** It is the canonical guide: token roles, contrast rules, typography, patterns, and a self-check. Values live in `app/globals.css`. Figma source: file `Vw3IyW4rgAoA2hysaFDRsd`, design system node `1256:24247`, reference page node `1169:14700`.

### Technology Stack
- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui (`radix-vega` style) on Radix primitives
- **Styling**: Tailwind CSS v4, with tokens as CSS variables in `app/globals.css`
- **Fonts**: Alte Haas Grotesk (`font-sans`, the default) and Atkinson Hyperlegible Mono (`font-mono`), both loaded in `app/layout.tsx`
- **Icons**: Phosphor (`@phosphor-icons/react`)
- **Type Safety**: TypeScript (strict mode)

### Cheat sheet

1. **One light theme.** No dark mode and no `dark:` variants.
2. **Semantic tokens first:**
   - `bg-background` (GREY) for the page
   - `bg-card` (SMOKE) for raised surfaces
   - `text-foreground` (BLACK) for text
   - `text-muted-foreground` (MID GREY) for captions
   - `border-border` (GRID GREY) for every line
3. **`primary` is BLUE.** Use it for *the* main CTA of a view, section bars, active states, links, and accent headings, with `text-primary-foreground` (SMOKE) on top. Hover and pressed states use `bg-dark-blue`.
4. **`secondary`, `muted`, and `accent` are SEMI GREY** — secondary buttons, subtle fills, hover backgrounds. `destructive` is for errors only.
5. **Brand utilities** — only when no semantic token fits: `dark-blue` for hover, `navy` for deep emphasis, `dark-grey` for dark panels. `black` is `#101010`.
6. **Never** use hex/rgb literals, arbitrary colours (`bg-[#…]`), Tailwind's default palette (`gray-*`, `blue-*`, `white`, …), gradients, or coloured shadows.
7. **Contrast:** light text only on BLUE, DARK BLUE, NAVY, DARK GREY, or BLACK. BLUE or MID GREY text on GREY is for large or non-essential text only.
8. **Fonts:**
   - `font-sans` is Alte Haas Grotesk (the default; headings and body). It has only `font-normal` and `font-bold`, so never `font-medium` or `font-semibold`.
   - `font-mono` is Atkinson Hyperlegible Mono (weights 200–800), for nav, buttons, labels, meta text, and data.
9. **Mono labels:** `font-mono uppercase tracking-widest`. **Section titles:** `font-bold uppercase`.
10. **Header scale:** `text-header-main` 36 / `text-header-sub` 20 / `text-header-small` 18 / `text-header-tiny` 16. `h1`–`h4` apply these by default, so use semantic heading tags.
11. **Square corners** (`--radius: 0`). No `rounded-full` or arbitrary radii except true circles.
12. **Borders, not shadows.** `shadow-xs` at most.
13. **Reuse `@/components/ui`** (Button, Card, Input, Label) before writing markup. Add primitives with `pnpm ui:add <name>`.
14. **Icons are Phosphor:** `@phosphor-icons/react`, with `/dist/ssr` in server components, and the `*Icon` names. Not Lucide.
15. **Merge classes with `cn()`** from `@/lib/utils`. Never import fonts outside `app/layout.tsx`.

### Styling Utilities

1. **Utility Function**: Always use `cn()` from `@/lib/utils` to merge classNames:
   ```typescript
   import { cn } from "@/lib/utils"
   className={cn("base-classes", className)}
   ```

2. **Component Variants**: Use `class-variance-authority` (cva) for components with multiple variants:
   ```typescript
   import { cva, type VariantProps } from "class-variance-authority"
   ```

## Server & API Architecture

**Before adding API routes, Server Actions, services, repositories, or tables, read `.github/context/server-architecture.md`.** It walks through adding a domain end to end. The `users` domain (`server/users/`) and `app/api/me/route.ts` are the working reference.

### Cheat sheet

1. **Request path:** entry point (`app/api/**/route.ts`, Server Action, or Server Component) → `server/{domain}/{domain}.service.ts` → `server/{domain}/{domain}.repository.ts` → Postgres with RLS. Never skip a layer.
2. **Organize by domain, not by layer:** `server/applications/` holds both the service and the repository. `server/shared/` is only for infrastructure.
3. **The app layer imports services only.** Repositories are internal to their domain folder. ESLint blocks `@/server/*/*.repository` and `@/config/db` outside `server/`.
4. **Services** (`{Entity}Service`, e.g. `UserService`):
   - take `userId` in the constructor and construct a `private` repository
   - own validation, business rules, and fallbacks
   - reach other domains only through their services
5. **Repositories** (`{Domain}Repository`, e.g. `UsersRepository`):
   - extend `BaseRepository` and use `this.query`, `this.queryOne`, and `this.transaction` with tagged templates only
   - contain no business rules
   - start with `import "server-only"`, like services
6. **Route handlers:**
   - guarded routes use `withAuth(handler, { roles })` from `@/lib/auth/guard`
   - public routes use `withRaft`
   - respond only with `RaftResponse.*`; no hand-built `NextResponse` and no `try/catch`
7. **Expected outcomes are returned, not thrown.** Services return `null` or a discriminated result union, and the route maps it to `RaftResponse.notFound()` / `.badRequest()`. Anything thrown becomes a quarantined 500.
8. **Identity always comes from `auth.userId`** (from `withAuth` / `requireUser()`), never from the request body or query string.
9. **Route `params` are a `Promise`:** `await` them, and type them with a `type` alias, not an `interface`.
10. **Server Components and Actions:** `requireUser()` or `requireRole("organizer")`, then a service. Client components call `app/api` routes through fetchers in `lib/api/`.
11. **Every new table enables RLS and defines its policies in the same migration** (`pnpm migrate:create <name>`). New tables default to full DML for `app_public`.
12. **Privileged writes** use a `SECURITY DEFINER` function (model: `grant_user_role()`), never `adminSql`.

## File Organization

### Directory Structure

```
app/                       # Next.js App Router
├── (auth)/                # Auth route group (sign-in, sign-up, …)
├── api/                   # API route handlers
├── [routes]/              # Route segments
├── fonts/                 # Self-hosted font files (Alte Haas Grotesk + licence)
├── layout.tsx             # Root layout (fonts, ThemeProvider)
├── page.tsx               # Pages
└── globals.css            # Design tokens

components/                # React components
├── ui/                    # Design system components (shadcn/ui)
└── [feature]/             # Feature-specific components (e.g., auth/, home/)

lib/                       # Utilities and helpers
├── utils.ts               # Core utilities (cn function)
├── utils/                 # Additional utility modules
├── api/                   # API clients and utilities
├── auth/                  # Auth helpers (withAuth guard)
├── hooks/                 # Custom React hooks
├── contexts/              # React Context providers
└── providers/             # App-level providers

types/                     # TypeScript type definitions
config/                    # Environment and config wiring (db, client/server env)

server/                    # Server-side code, organized by DOMAIN not by layer
├── README.md              # Full spec — read before adding server code
├── shared/                # Infrastructure the domains extend (base.repository.ts)
└── users/                 # One folder per domain
    ├── users.service.ts       # Business logic; what the app imports
    └── users.repository.ts    # Data access; internal to the domain
```

### File Placement Rules

#### UI Components (`components/ui/`)
- **Purpose**: Generic, reusable design system components
- **Examples**: Button, Card, Input, Dialog, Select, etc.
- **Characteristics**:
  - Framework-agnostic
  - Highly reusable
  - Follow shadcn/ui patterns
  - Accept `className` prop
  - Use `data-slot` attributes
  - Export variants when using `cva`

#### Feature Components (`components/[feature]/`)
- **Purpose**: Business logic or feature-specific components
- **Examples**: `SignInForm`, `HomeAuthActions`, `UserProfile`, `Dashboard`
- **Characteristics**:
  - May contain business logic
  - Composes UI components
  - Feature-specific functionality
  - Can be page-specific or reusable within a feature

#### Server Code (`server/`)
- **Purpose**: Server-side logic, data access, business logic
- **Structure**: one folder per **domain**, never top-level layer trees
  - `{domain}/{domain}.repository.ts`: data access, extends `BaseRepository`, internal to the domain
  - `{domain}/{domain}.service.ts`: business logic and validation — the only entry point for the app
  - `shared/`: infrastructure the domains extend (`base.repository.ts`)
  - Environment and config wiring lives in `config/` at the project root, not here
- **Usage**: Next.js Server Components, Server Actions, API routes — import services only
- **Data access**: repositories extend `BaseRepository`, which binds queries to one user so
  Row-Level Security applies. Never import `@/config/db` or another domain's repository;
  an ESLint rule blocks both from the app layer.
- **Full spec**: `server/README.md`. For the end-to-end flow (route → service → repository → RLS), see `.github/context/server-architecture.md` and the "Server & API Architecture" section above

#### Hooks (`lib/hooks/`)
- **Purpose**: Reusable React hooks
- **Naming**: `use[Name].ts` (e.g., `useAuth.ts`, `useDebounce.ts`)
- **Usage**: Shared logic across multiple components

#### Contexts (`lib/contexts/`)
- **Purpose**: React Context for global state
- **Naming**: `[Name]Context.tsx` (e.g., `AuthContext.tsx`)

#### Providers (`lib/providers/`)
- **Purpose**: Provider components that wrap the app
- **Naming**: `[Name]Provider.tsx` (e.g., `AuthProvider.tsx`)
- **Usage**: Wrap in root layout

#### Types (`types/`)
- **Purpose**: Shared TypeScript definitions
- **Naming**: lowercase, by domain/resource (e.g., `user.ts`, `auth.ts`) — see `types/README.md`.
  The exported types inside remain PascalCase (`interface AuthContext`).

### Naming Conventions

- **Components**: PascalCase (e.g., `SignInForm.tsx`, `UserProfile.tsx`). shadcn primitives in `components/ui/` keep shadcn's lowercase names (`button.tsx`).
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `apiClient.ts`)
- **Types**: lowercase file names (e.g., `user.ts`, `product.ts`); PascalCase for the types themselves
- **Server files**: `{domain}.service.ts` / `{domain}.repository.ts` (e.g., `users/users.service.ts`)

### Path Aliases

Always use TypeScript path aliases instead of relative imports. `@/*` maps to the repo root:

- `@/components` → `components`
- `@/components/ui` → `components/ui`
- `@/lib` → `lib`
- `@/lib/utils` → `lib/utils.ts`
- `@/lib/hooks` → `lib/hooks`
- `@/types` → `types`

**Good**:
```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

**Bad**:
```typescript
import { Button } from "../../components/ui/button"
import { cn } from "../../lib/utils"
```

## Component Patterns

### Standard Component Template

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

interface ComponentProps extends React.ComponentProps<"div"> {
  // Add component-specific props here
}

export function Component({ className, ...props }: ComponentProps) {
  return (
    <div
      data-slot="component"
      className={cn("base-classes-here", className)}
      {...props}
    />
  )
}
```

### Component with Variants Template

```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        secondary: "secondary-classes",
      },
      size: {
        sm: "size-sm-classes",
        md: "size-md-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

interface ComponentProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof componentVariants> {
  // Additional props
}

export function Component({ className, variant, size, ...props }: ComponentProps) {
  return (
    <div
      data-slot="component"
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Component, componentVariants }
```

### Import Organization

Order imports as follows:
1. React and Next.js
2. Third-party libraries
3. Internal imports (using `@/` aliases)
4. Type imports (use `import type`)

```typescript
import { useState } from "react"
import { CaretDownIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AuthContext } from "@/types/auth"
```

## Best Practices

1. ✅ **Always use `cn()`** for className merging
2. ✅ **Use design tokens** for every colour, font, and size — see `.github/context/design-system.md`
3. ✅ **Light theme only** — use semantic color tokens, never `dark:` variants
4. ✅ **Use path aliases** (`@/`) for imports
5. ✅ **Type everything** with TypeScript
6. ✅ **Export variants** when using `cva`
7. ✅ **Use `data-slot`** attributes for component identification
8. ✅ **Compose components** - build complex from simple UI components
9. ✅ **Separate concerns** - UI, logic, and data access
10. ✅ **Follow Next.js conventions** - App Router patterns

## Adding New Components

### UI Components (shadcn/ui)
```bash
pnpm ui:add [component-name]
```
This will add the component to `components/ui/` following shadcn/ui patterns.

### Custom Components
1. Determine if it's a UI component (generic, reusable) or feature component
2. Place in appropriate directory:
   - UI component → `components/ui/`
   - Feature component → `components/[feature]/`
3. Follow the component template above
4. Export the component and any variants/types

## Common Patterns

### Client Components
Mark components that use hooks, event handlers, or browser APIs:
```typescript
"use client"

import { useState } from "react"
```

### Server Components
Default in Next.js App Router. Use for data fetching, no client-side JavaScript needed.

### API Routes
Place in `app/api/[route]/route.ts`. All routes go through the Raft SDK
(`@uw-datasci/raft`) — **never** construct `NextResponse`/`Response` by hand, and never
wrap the whole handler in a try/catch. Full contract: `.github/context/raft-reference.md`.

Guarded routes use `withAuth`, which applies `withRaft` internally:

```typescript
import { RaftResponse } from "@uw-datasci/raft"
import { withAuth } from "@/lib/auth/guard"
import type { AuthContext } from "@/types/auth"

async function handler(_request: Request, _context: unknown, auth: AuthContext) {
  return RaftResponse.ok({ userId: auth.userId })
}

export const GET = withAuth(handler, { roles: ["organizer"] })
```

Public routes wrap themselves:

```typescript
import { withRaft, RaftResponse } from "@uw-datasci/raft"

export const GET = withRaft(async (request, { params }) => {
  const { id } = await params            // Next 16: params is a Promise
  if (!id) return RaftResponse.badRequest("id is required")

  const event = await new EventService(id).get()   // throws → auto 500 + quarantine
  if (!event) return RaftResponse.notFound("Event not found")

  return RaftResponse.ok(event)
})
```

Two things to know:
- Use `RaftResponse.badRequest()` / `.forbidden()` for expected 4xx outcomes. Throwing
  `ApiError("...", 400)` does **not** produce a 400 — `withRaft` quarantines everything
  it catches and returns a 500 regardless of `statusCode`.
- Route params must be a **type alias** (`type Params = { id: string }`), not an
  `interface` — an interface has no implicit index signature and will not satisfy the
  wrapper's context constraint.

## Questions to Ask Before Creating Files

1. **Is this a UI component or feature component?**
   - UI → `components/ui/`
   - Feature → `components/[feature]/`

2. **Does this need server-side logic?**
   - Yes → `server/{domain}/{domain}.service.ts` (business logic) or
     `server/{domain}/{domain}.repository.ts` (data access)

3. **Is this reusable logic?**
   - Hook → `lib/hooks/`
   - Utility → `lib/utils/`

4. **Is this a type definition?**
   - Yes → `types/`

5. **Does this need global state?**
   - Context → `lib/contexts/`
   - Provider → `lib/providers/`

