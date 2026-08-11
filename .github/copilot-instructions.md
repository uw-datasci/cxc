# Copilot Instructions - Design System & Repository Organization

## Overview
This repository uses Next.js 16 with the App Router, shadcn/ui design system, Tailwind CSS v4, and a structured file organization pattern. Follow these guidelines when generating or modifying files.

## Design System

### Technology Stack
- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui (New York style)
- **Styling**: Tailwind CSS v4 with CSS variables
- **Color System**: OKLCH color space
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Type Safety**: TypeScript (strict mode)

### Styling Guidelines

1. **Use CSS Variables**: All colors, spacing, and design tokens are defined as CSS variables in `src/app/globals.css`. Never hardcode color values.

2. **Color Tokens**: Use semantic color names:
   - `bg-primary`, `text-primary-foreground`
   - `bg-secondary`, `text-secondary-foreground`
   - `bg-muted`, `text-muted-foreground`
   - `bg-accent`, `text-accent-foreground`
   - `bg-destructive`, `text-destructive`
   - `bg-card`, `text-card-foreground`
   - `border`, `input`, `ring`

3. **Dark Mode**: All components should support dark mode automatically via CSS variables. Test both light and dark themes.

4. **Utility Function**: Always use `cn()` from `@/lib/utils` to merge classNames:
   ```typescript
   import { cn } from "@/lib/utils"
   className={cn("base-classes", className)}
   ```

5. **Component Variants**: Use `class-variance-authority` (cva) for components with multiple variants:
   ```typescript
   import { cva, type VariantProps } from "class-variance-authority"
   ```

6. **Border Radius**: Use semantic radius tokens:
   - `rounded-sm` (radius-sm)
   - `rounded-md` (radius-md)
   - `rounded-lg` (radius-lg)
   - `rounded-xl` (radius-xl)

## File Organization

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API route handlers
│   ├── [routes]/          # Route segments
│   ├── layout.tsx         # Layouts
│   ├── page.tsx           # Pages
│   └── globals.css        # Global styles
│
├── components/            # React components
│   ├── ui/               # Design system components (shadcn/ui)
│   └── [feature]/        # Feature-specific components
│
├── lib/                   # Utilities and helpers
│   ├── utils.ts          # Core utilities (cn function)
│   ├── utils/            # Additional utility modules
│   └── api/              # API clients and utilities
│
├── hooks/                 # Custom React hooks
├── contexts/              # React Context providers
├── providers/             # App-level providers
├── types/                 # TypeScript type definitions
└── server/                # Server-side code
    ├── config/           # Configuration
    ├── repositories/     # Data access layer
    └── services/         # Business logic
```

### File Placement Rules

#### UI Components (`src/components/ui/`)
- **Purpose**: Generic, reusable design system components
- **Examples**: Button, Card, Input, Dialog, Select, etc.
- **Characteristics**:
  - Framework-agnostic
  - Highly reusable
  - Follow shadcn/ui patterns
  - Accept `className` prop
  - Use `data-slot` attributes
  - Export variants when using `cva`

#### Feature Components (`src/components/`)
- **Purpose**: Business logic or feature-specific components
- **Examples**: `AnimatedBox`, `UserProfile`, `Dashboard`, `ProductCard`
- **Characteristics**:
  - May contain business logic
  - Composes UI components
  - Feature-specific functionality
  - Can be page-specific or reusable within a feature

#### Server Code (`src/server/`)
- **Purpose**: Server-side logic, data access, business logic
- **Structure**:
  - `config/`: Configuration files, environment setup
  - `repositories/`: Data access layer (database queries, API calls)
  - `services/`: Business logic, orchestration
- **Usage**: Next.js Server Components, Server Actions, API routes

#### Hooks (`src/hooks/`)
- **Purpose**: Reusable React hooks
- **Naming**: `use[Name].ts` (e.g., `useAuth.ts`, `useDebounce.ts`)
- **Usage**: Shared logic across multiple components

#### Contexts (`src/contexts/`)
- **Purpose**: React Context for global state
- **Naming**: `[Name]Context.tsx` (e.g., `ThemeContext.tsx`)

#### Providers (`src/providers/`)
- **Purpose**: Provider components that wrap the app
- **Naming**: `[Name]Provider.tsx` (e.g., `ThemeProvider.tsx`)
- **Usage**: Wrap in root layout

#### Types (`src/types/`)
- **Purpose**: Shared TypeScript definitions
- **Naming**: PascalCase (e.g., `User.ts`, `ApiResponse.ts`)

### Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `apiClient.ts`)
- **Types**: PascalCase (e.g., `User.ts`, `Product.ts`)
- **Server files**: camelCase (e.g., `userService.ts`, `authRepository.ts`)

### Path Aliases

Always use TypeScript path aliases instead of relative imports:

- `@/components` → `src/components`
- `@/components/ui` → `src/components/ui`
- `@/lib` → `src/lib`
- `@/lib/utils` → `src/lib/utils`
- `@/hooks` → `src/hooks`
- `@/types` → `src/types`

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
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { User } from "@/types"
```

## Best Practices

1. ✅ **Always use `cn()`** for className merging
2. ✅ **Use CSS variables** for all design tokens
3. ✅ **Support dark mode** via semantic color tokens
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
This will add the component to `src/components/ui/` following shadcn/ui patterns.

### Custom Components
1. Determine if it's a UI component (generic, reusable) or feature component
2. Place in appropriate directory:
   - UI component → `src/components/ui/`
   - Feature component → `src/components/`
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
Place in `src/app/api/[route]/route.ts`:
```typescript
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "Hello" })
}
```

## Questions to Ask Before Creating Files

1. **Is this a UI component or feature component?**
   - UI → `src/components/ui/`
   - Feature → `src/components/`

2. **Does this need server-side logic?**
   - Yes → `src/server/services/` or `src/server/repositories/`

3. **Is this reusable logic?**
   - Hook → `src/hooks/`
   - Utility → `src/lib/utils/`

4. **Is this a type definition?**
   - Yes → `src/types/`

5. **Does this need global state?**
   - Context → `src/contexts/`
   - Provider → `src/providers/`

