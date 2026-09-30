# Next.js template

This is a Next.js template with shadcn/ui.

## Installing dependencies

This app depends on `@uw-datasci/raft`, published to **GitHub Packages** rather than
npm. `.npmrc` routes the `@uw-datasci` scope there, but the token is not checked in, so
`pnpm install` will fail with a `401` until you export one:

```bash
export NODE_AUTH_TOKEN=<a GitHub PAT with the read:packages scope>
pnpm install
```

Put the export in your shell profile so it persists. CI supplies the token on its own,
via `actions/setup-node` in `nexus-workflows`.

## Server & API architecture

Server code is organized by domain. Every request follows the same path:

```
app/api/**/route.ts · Server Action · Server Component    (auth: withAuth / requireUser)
  → server/{domain}/{domain}.service.ts                   (business rules)
    → server/{domain}/{domain}.repository.ts              (SQL, extends BaseRepository)
      → Postgres with Row-Level Security
```

- `.github/context/server-architecture.md` — the end-to-end guide, with a worked example of
  adding a domain (migration + RLS, repository, service, route, Server Action)
- `server/README.md` — the folder spec and RLS rationale
- `.github/context/raft-reference.md` — the Raft SDK that every route handler goes through
- `server/users/` and `app/api/me/route.ts` — the working reference implementation

## Design system

Colours, fonts, and the header scale come from the CxC W27 Figma file and live as tokens in
`app/globals.css`. The guide to using them is `.github/context/design-system.md`: which token
fits each role, contrast rules, typography, patterns, and do/don'ts.

## Working with AI agents

Every major coding agent picks up the design and server rules automatically:

| Tool | Reads |
| --- | --- |
| Claude Code | `CLAUDE.md`, which imports `AGENTS.md` |
| Codex | `AGENTS.md` |
| Cursor | `AGENTS.md`, plus the rules in `.cursor/rules/`, auto-attached by file: `design-system.mdc` for UI, `server-architecture.mdc` for API and server code |
| GitHub Copilot | `.github/copilot-instructions.md` (and `AGENTS.md` in agent mode) |

Each of those files carries short cheat sheets and points the agent to the full guides in
`.github/context/`. For anything bigger than a small tweak, name the guide in your prompt.

**UI**

> Build `app/sponsors/page.tsx` following `.github/context/design-system.md`. Use a numbered
> section bar, then a grid of `bg-card` logo tiles grouped by tier. Use only
> `@/components/ui` and semantic tokens, and run the self-check in §7.1 when done.

> Restyle `components/auth/SignInForm.tsx` to match `.github/context/design-system.md`:
> mono labels, square inputs, one primary CTA. Don't change behaviour.

**From Figma** (with the Figma MCP):

> Implement this Figma frame: <url>. Map every colour, font, and size onto the tokens in
> `.github/context/design-system.md`. No hex values, no `text-[Npx]`, and reuse
> `@/components/ui`.

**Server / API**

> Add a `teams` domain following `.github/context/server-architecture.md`: a migration with
> RLS (members read their own team, organizers read all), `TeamsRepository`, `TeamService`,
> and `GET`/`POST` `app/api/teams/route.ts` guarded with `withAuth`. Run the self-check in §5.

**Keep the docs in sync.** The canonical guides are `.github/context/design-system.md` and
`.github/context/server-architecture.md`. When either system changes, update the guide and
the cheat sheets in `AGENTS.md`, `.github/copilot-instructions.md`, and `.cursor/rules/*.mdc`
together — and `app/globals.css` for design changes.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
