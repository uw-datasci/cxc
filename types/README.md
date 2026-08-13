# Type Definitions

This folder contains TypeScript type definitions, interfaces, and type utilities.
Use this folder for shared types that are used across multiple parts of the application.

## Organization Guidelines

- Organize by domain/resource: `user.ts`, `product.ts`, `order.ts`
- Or organize by category: `models.ts` (data models), `api.ts` (API types), `common.ts` (shared types)
- Create separate files for different entities or feature areas
- Use index files to re-export related types for easier imports
- Keep type utilities and helpers in separate files (e.g., `utils.ts`)
