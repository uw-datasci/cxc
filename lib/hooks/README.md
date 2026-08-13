# Custom Hooks

This folder contains custom React hooks that encapsulate reusable logic.
Use this folder for hooks that can be shared across multiple components.

## Organization Guidelines

- Create separate files for each hook or related group of hooks
- Use the `use-` prefix: `use-auth.ts`, `use-api.ts`, `use-local-storage.ts`
- Group related hooks in the same file if they share similar concerns
- Organize by domain/feature: authentication hooks, data fetching hooks, UI hooks, etc.