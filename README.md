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

## API routes

Route handlers use the Raft SDK for responses and error quarantine — see
`.github/context/raft-reference.md`, and `app/api/me/route.ts` for a worked example.

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
