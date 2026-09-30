# AGENTS.md

CxC — UWaterloo Data Science Club's data science competition site.
Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui
(`radix-vega` style) · pnpm. Path alias `@/*` maps to the repo root (there is no `src/`).

Commands: `pnpm dev`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm ui:add <component>`.

## Building UI

**Before creating or editing any page, component, or style, read
[`.github/context/design-system.md`](.github/context/design-system.md).**
It is the canonical guide to the CxC design system. The values live in `app/globals.css`.

### Design system cheat sheet

1. **One light theme.** No dark mode and no `dark:` variants.
2. **Semantic tokens first:**
   - `bg-background` (GREY) for the page
   - `bg-card` (SMOKE) for raised surfaces
   - `text-foreground` (BLACK) for text
   - `text-muted-foreground` (MID GREY) for captions
   - `border-border` (GRID GREY) for every line
3. **`primary` is BLUE.** Use it for *the* main CTA of a view, section bars, active states,
   links, and accent headings, with `text-primary-foreground` (SMOKE) on top. Hover and
   pressed states use `bg-dark-blue`.
4. **`secondary`, `muted`, and `accent` are SEMI GREY** — secondary buttons, subtle fills,
   hover backgrounds. `destructive` is for errors only.
5. **Brand utilities** — only when no semantic token fits: `dark-blue` for hover, `navy` for
   deep emphasis, `dark-grey` for dark panels. `black` is `#101010`.
6. **Never** use hex/rgb literals, arbitrary colours (`bg-[#…]`), Tailwind's default palette
   (`gray-*`, `blue-*`, `white`, …), gradients, or coloured shadows.
7. **Contrast:** light text only on BLUE, DARK BLUE, NAVY, DARK GREY, or BLACK. BLUE or MID
   GREY text on GREY is for large or non-essential text only.
8. **Fonts:**
   - `font-sans` is Alte Haas Grotesk (the default; headings and body). It has only
     `font-normal` and `font-bold`, so never `font-medium` or `font-semibold`.
   - `font-mono` is Atkinson Hyperlegible Mono (weights 200–800), for nav, buttons, labels,
     meta text, and data.
9. **Mono labels:** `font-mono uppercase tracking-widest`. **Section titles:**
   `font-bold uppercase`.
10. **Header scale:** `text-header-main` 36 / `text-header-sub` 20 / `text-header-small` 18 /
    `text-header-tiny` 16. `h1`–`h4` apply these by default, so use semantic heading tags.
11. **Square corners** (`--radius: 0`). No `rounded-full` or arbitrary radii except true
    circles.
12. **Borders, not shadows.** `shadow-xs` at most.
13. **Reuse `@/components/ui`** (Button, Card, Input, Label) before writing markup. Add
    primitives with `pnpm ui:add <name>`.
14. **Icons are Phosphor:** `@phosphor-icons/react`, with `/dist/ssr` in server components,
    and the `*Icon` names. Not Lucide.
15. **Merge classes with `cn()`** from `@/lib/utils`. Never import fonts outside
    `app/layout.tsx`.

Run the self-check at the end of the design guide (§7.1) before finishing any UI task.

## Server code and APIs

**Before adding API routes, Server Actions, services, repositories, or tables, read
[`.github/context/server-architecture.md`](.github/context/server-architecture.md).**
It walks through adding a domain end to end. The `users` domain (`server/users/`) and
`app/api/me/route.ts` are the working reference.

### Server cheat sheet

1. **Request path:** entry point (`app/api/**/route.ts`, Server Action, or Server Component)
   → `server/{domain}/{domain}.service.ts` → `server/{domain}/{domain}.repository.ts` →
   Postgres with RLS. Never skip a layer.
2. **Organize by domain, not by layer:** `server/applications/` holds both the service and
   the repository. `server/shared/` is only for infrastructure.
3. **The app layer imports services only.** Repositories are internal to their domain
   folder. ESLint blocks `@/server/*/*.repository` and `@/config/db` outside `server/`.
4. **Services** (`{Entity}Service`, e.g. `UserService`):
   - take `userId` in the constructor and construct a `private` repository
   - own validation, business rules, and fallbacks
   - reach other domains only through their services
5. **Repositories** (`{Domain}Repository`, e.g. `UsersRepository`):
   - extend `BaseRepository` and use `this.query`, `this.queryOne`, and `this.transaction`
     with tagged templates only
   - contain no business rules
   - start with `import "server-only"`, like services
6. **Route handlers:**
   - guarded routes use `withAuth(handler, { roles })` from `@/lib/auth/guard`
   - public routes use `withRaft`
   - respond only with `RaftResponse.*`; no hand-built `NextResponse` and no `try/catch`
7. **Expected outcomes are returned, not thrown.** Services return `null` or a
   discriminated result union, and the route maps it to
   `RaftResponse.notFound()` / `.badRequest()`. Anything thrown becomes a quarantined 500.
8. **Identity always comes from `auth.userId`** (from `withAuth` / `requireUser()`), never
   from the request body or query string.
9. **Route `params` are a `Promise`:** `await` them, and type them with a `type` alias, not
   an `interface`.
10. **Server Components and Actions:** `requireUser()` or `requireRole("organizer")`, then a
    service. Client components call `app/api` routes through fetchers in `lib/api/`.
11. **Every new table enables RLS and defines its policies in the same migration**
    (`pnpm migrate:create <name>`). New tables default to full DML for `app_public`.
12. **Privileged writes** use a `SECURITY DEFINER` function (model: `grant_user_role()`),
    never `adminSql`.

Run the self-check at the end of the server guide (§5) before finishing any server task.

## Other references

- Raft SDK details: `.github/context/raft-reference.md`.
- Server folder spec and RLS rationale: `server/README.md`.
- File organization and component templates: `.github/copilot-instructions.md`.

## Keeping agent docs in sync

The canonical guides are `.github/context/design-system.md` and
`.github/context/server-architecture.md`. Their cheat sheets are repeated in
`.github/copilot-instructions.md`, `.cursor/rules/design-system.mdc`, and
`.cursor/rules/server-architecture.mdc`. When either system changes, update the guide and
every cheat sheet together — and for the design system, `app/globals.css` too.
`CLAUDE.md` just imports this file.
