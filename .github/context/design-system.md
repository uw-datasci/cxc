# CxC Design System — Reference for AI Agents

Read this before creating or editing **any** UI in this repo: pages, layouts, components,
or styles. It tells you which token to reach for, which font to use, and what not to do.

- **Source of truth for values:** `app/globals.css`. This doc explains *intent*; if a value
  here ever disagrees with `globals.css`, `globals.css` wins — and this doc should be fixed.
- **Figma source:** file `Vw3IyW4rgAoA2hysaFDRsd` (CxC-W27).
  - Design system: node `1256:24247`
  - Reference landing page built with it: node `1169:14700`

  If you have the Figma MCP, pull those nodes directly. When implementing any Figma frame,
  map every colour, font, and size onto the tokens below — never paste Figma's hex values
  or pixel sizes into the code.

This doc is the canonical design guidance. `AGENTS.md`, `.github/copilot-instructions.md`,
and `.cursor/rules/design-system.mdc` carry a condensed cheat sheet of it — update them
together.

---

## 1. Visual language

A light, technical, editorial look — think engineering drawing meets Swiss poster:

- A **GREY canvas** with thin **GRID GREY** lines and rules (borders, dividers, grid overlays).
- **Square corners everywhere.** No pills, no rounded cards.
- **Solid BLUE blocks** for emphasis: full-width numbered section bars ("01 — ABOUT US"),
  the primary CTA, and accent headings.
- Small **square, outlined BLUE markers** as bullets and decorative anchors.
- **Mono type** for labels, nav, metadata, buttons, and body copy blocks; **bold Grotesk**
  for section titles and big numbers.
- Dark, monochrome 3D imagery sits on top of the light canvas. The UI itself stays light.

There is **one theme: light**. `components/theme-provider.tsx` forces it; there is no dark
mode to support.

---

## 2. Colour

### 2.1 Semantic tokens — use these first

Every colour is a Tailwind utility generated from a CSS variable: `bg-*`, `text-*`,
`border-*`, `ring-*`, `fill-*`, etc.

| Token | Value | Use for | Not for |
| --- | --- | --- | --- |
| `background` | GREY `#e8e8e8` | The page canvas | Cards or raised surfaces |
| `foreground` | BLACK `#101010` | Default text, icons, and headings | — |
| `card` / `card-foreground` | SMOKE `#f7f7f7` / BLACK | Raised surfaces: cards, panels, logo tiles, FAQ rows, form containers | The page background |
| `popover` / `popover-foreground` | SMOKE / BLACK | Dropdowns, menus, tooltips, dialogs | — |
| `primary` / `primary-foreground` | BLUE `#1b66ff` / SMOKE | **The** main CTA of a view, section bars, active/selected states, links, accent headings, markers | Large body-text areas; more than one competing CTA |
| `secondary` / `secondary-foreground` | SEMI GREY `#dbdbdb` / BLACK | Secondary buttons and neutral chips | Primary actions |
| `muted` | SEMI GREY | Subtle fills: skeletons, disabled areas, table stripes | Text |
| `muted-foreground` | MID GREY `#757271` | Secondary text: captions, helper text, placeholders, timestamps | Body copy or anything essential (see §2.3) |
| `accent` / `accent-foreground` | SEMI GREY / BLACK | Hover and highlight backgrounds on menu items and ghost buttons | Brand emphasis (that's `primary`) |
| `border` | GRID GREY `#cecece` | All borders, dividers, and grid lines. The default for `border` / `divide` | — |
| `input` | GRID GREY | Form-control borders | — |
| `ring` | BLUE | Focus rings (`focus-visible:ring-ring/50`) | Decoration |
| `destructive` | red | Errors, destructive actions, invalid fields | Anything else. It is the only non-palette colour |
| `chart-1` … `chart-5` | BLUE, DARK BLUE, NAVY, MID GREY, DARK GREY | Data-visualisation series, in that order | UI chrome |

`sidebar-*` tokens also exist, mirroring card/primary/accent/border, for a future sidebar.

### 2.2 Brand palette utilities — only when no semantic token fits

The raw palette is also exposed, named exactly like the Figma variables:

| Utility | Hex | Intended use |
| --- | --- | --- |
| `smoke` | `#f7f7f7` | (= `card`) — prefer `card` |
| `grey` | `#e8e8e8` | (= `background`) — prefer `background` |
| `semi-grey` | `#dbdbdb` | (= `secondary` / `muted`) — prefer those |
| `grid-grey` | `#cecece` | (= `border`) — prefer `border` |
| `mid-grey` | `#757271` | (= `muted-foreground`) — prefer that |
| `dark-grey` | `#333130` | Dark panels, image backdrops, dark logos/graphics |
| `black` | `#101010` | (= `foreground`). Note that `black` is **not** `#000` in this project |
| `blue` | `#1b66ff` | (= `primary`) — prefer `primary` |
| `dark-blue` | `#0e49c0` | Hover/pressed state of anything BLUE (`hover:bg-dark-blue`) |
| `navy` | `#082b71` | Deep emphasis blocks and high-contrast blue surfaces |

Rule of thumb: when a semantic token means the same thing, use the semantic one
(`bg-card`, not `bg-smoke`). Reach for `dark-blue`, `navy`, and `dark-grey` directly,
because they have no semantic alias.

### 2.3 Contrast rules

These are measured WCAG ratios. Follow them.

- **Light text (`text-primary-foreground` / SMOKE) only on dark fills:**
  `primary`/BLUE (4.46:1), `dark-blue` (7.2:1), `navy` (12.3:1), `dark-grey` (12.1:1),
  `black`.
- **Dark text (`text-foreground`) on the light greys:** `background`, `card`, `secondary`,
  `muted`, and `border` fills (≥ 12:1). On a `mid-grey` fill (4.0:1), use large text only.
- **BLUE text on the GREY canvas is 3.9:1.** Use it only for large text (≥ 24px, or ≥ 18px
  bold) — accent headings, not paragraphs.
- **`muted-foreground` on `background` is 3.9:1** (4.45:1 on `card`). Keep it for
  non-essential secondary text; anything the user must read uses `text-foreground`.

### 2.4 Never

- Hex, `rgb()`, `hsl()`, or `oklch()` literals in components, and arbitrary colour values
  like `bg-[#1b66ff]` or `text-[#333]`.
- Tailwind's default palette: `bg-blue-500`, `text-gray-600`, `zinc-*`, `slate-*`,
  `bg-white`, and similar. The palette above is the whole palette.
- `dark:` variants. There is no dark theme. The `dark:` classes inside the shadcn files in
  `components/ui/*` are inert leftovers — don't add new ones.
- Gradients, glows, or coloured shadows.
- Opacity tricks that invent new colours (`bg-primary/30` as a surface). Opacity is fine
  for focus rings and overlays.

---

## 3. Typography

Both fonts are loaded once in `app/layout.tsx` via `next/font`. Don't import fonts anywhere
else.

| Utility | Family | Weights available | Use for |
| --- | --- | --- | --- |
| `font-sans` (default) / `font-heading` | **Alte Haas Grotesk** | **400 and 700 only** | Headings, section titles, big numbers/stats, general body text |
| `font-mono` | **Atkinson Hyperlegible Mono** | 200 to 800 (variable) | Nav links, buttons, labels, eyebrow/meta text, dates, captions, form UI, data, and long-form copy blocks on marketing pages |

- **Grotesk has only 400 and 700.** Use `font-normal` or `font-bold` with it. `font-medium`
  and `font-semibold` quietly fall back to 400 or 700 and look inconsistent.
- **Mono supports the full range:** `font-extralight` (200) through `font-extrabold` (800).
  Large decorative numerals such as section numbers look right in `font-extralight`.
- **Mono labels are usually UPPERCASE with wide tracking:**
  `font-mono uppercase tracking-widest`.
- **Section titles are Grotesk Bold, uppercase:** `font-bold uppercase`.
- `Button` already renders its label in `font-mono`.

### 3.1 Header scale

| Utility | Size | Figma name | Default element |
| --- | --- | --- | --- |
| `text-header-main` | 36px | Main header | `h1` |
| `text-header-sub` | 20px | Sub header | `h2` |
| `text-header-small` | 18px | Small header | `h3` |
| `text-header-tiny` | 16px | Tiny header | `h4` |

`h1`–`h4` pick up `font-heading` and their size automatically (see `@layer base` in
`globals.css`), so use semantic heading tags and override only when needed:
`<h2 className="text-header-main font-bold uppercase">`. Line height is `normal`.

For body and UI text, use Tailwind's standard steps (`text-xs`, `text-sm`, `text-base`,
`text-lg`). Hero numerals and section-bar numbers may go larger (`text-6xl` to `text-8xl`).
Avoid arbitrary `text-[17px]` values.

---

## 4. Shape, spacing, and elevation

- **Radius is 0.** `--radius: 0` makes every `rounded-*` utility — and every radius inside
  the shadcn components — resolve to square. Don't add arbitrary radii
  (`rounded-[8px]`) or `rounded-full`. The only exception is genuinely circular things:
  avatars and radial/circle decorations.
- **Borders, not shadows.** Separate surfaces with `border border-border` and a fill
  change (`bg-card` on `bg-background`). `shadow-xs` is the ceiling.
- **Spacing:** Tailwind's default spacing scale. Layouts are airy, with generous section
  padding (`py-24` and up between landing-page sections) and tight, grid-aligned content.

### 4.1 Motion

- Use the `animate-*` tokens defined in the motion `@theme` block of `globals.css`
  (`animate-pop-in`, `animate-draw-x`, `animate-compass-needle`, …). Add new keyframes there,
  not inline in components.
- **Every animation is paired with `motion-reduce:`** — usually `motion-reduce:animate-none`,
  or `motion-reduce:hidden` for purely decorative moving parts. JS-driven motion checks
  `prefers-reduced-motion` and stays still.
- Motion is mechanical and quiet, like instruments: short ease-out entrances, hairlines
  drawing from their markers, slow loops. UI elements never use bounce, elastic, or springy
  easing. The one exception is an instrument's own physics on a decorative gauge (a compass
  needle damping to rest). Nothing loops fast enough to pull focus from the content.

---

## 5. Components and icons

- **Reuse `components/ui/*` first.** What exists today:
  - `Button` — variants:
    - `default`: BLUE CTA, `hover:bg-dark-blue`
    - `outline`, `secondary`, `ghost`, `link`, `destructive`
    - sizes: `xs` / `sm` / `default` / `lg` and `icon*`
    - `asChild` to render a `next/link`
  - `Card` with `CardHeader` / `CardTitle` / `CardDescription` / `CardAction` /
    `CardContent` / `CardFooter`
  - `Input`
  - `Label`
- **Need another primitive** (Dialog, Select, Accordion, Tabs, …)? Run `pnpm ui:add <name>`.
  It pulls the shadcn component, which already reads these tokens. After adding it, check
  it against this doc: remove any `font-medium` on Grotesk text and any `dark:` additions
  you don't need.
- **Don't restyle shared primitives per page.** Pass a `className` for layout tweaks. If a
  visual variant is needed in several places, add a `cva` variant to the component.
- **Icons: Phosphor** (`@phosphor-icons/react`, set as `iconLibrary` in `components.json`).
  - Server components: import from `@phosphor-icons/react/dist/ssr`.
  - Client components: import from `@phosphor-icons/react`.
  - Use the `*Icon` names (`CaretDownIcon`, not the deprecated `CaretDown`).
  - Colour icons with `text-*` tokens.
  - Don't use `lucide-react`, even though it is installed as a shadcn dependency.
- Always merge classes with `cn()` from `@/lib/utils`.

---

## 6. Patterns

These are recurring pieces of the reference page, built only from tokens. They are
**patterns, not components** — copy and adapt them. When a pattern is used on more than one
page, extract it into `components/`.

### 6.1 Numbered section bar

```tsx
<div className="flex items-end justify-between bg-primary px-16 text-primary-foreground">
  <span aria-hidden className="font-mono text-8xl leading-none font-extralight">
    01
  </span>
  <h2 className="py-5 text-header-main font-bold uppercase">About us</h2>
</div>
```

### 6.2 Eyebrow / meta label with a square marker

```tsx
<p className="flex items-center gap-3 font-mono text-sm tracking-widest uppercase">
  <span aria-hidden className="size-2 border-2 border-primary" />
  Student-run AI hackathon
</p>
```

### 6.3 Primary CTA — one per view

```tsx
<Button asChild size="lg" className="px-8 tracking-widest uppercase">
  <Link href="/sign-up">Register now</Link>
</Button>
```

### 6.4 Accent heading and mono body copy

```tsx
<h3 className="text-header-main font-bold text-primary uppercase">A fresh new start</h3>
<p className="max-w-prose font-mono text-base leading-relaxed tracking-wide">
  Since last year&apos;s iteration of CxC, we&apos;ve pivoted to a full in-person weekend.
</p>
```

### 6.5 Content tile (logo tile, info panel)

```tsx
<div className="border border-border bg-card p-6">…</div>
```

### 6.6 Stat

```tsx
<div className="flex flex-col gap-1">
  <span className="text-6xl font-bold">300+</span>
  <span className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
    Participants
  </span>
</div>
```

### 6.7 FAQ row

```tsx
import { CaretDownIcon, DiamondIcon } from "@phosphor-icons/react/dist/ssr";

<details className="group border-b-2 border-primary bg-card">
  <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 font-mono text-sm">
    <DiamondIcon aria-hidden className="size-4 text-primary" />
    What is CxC?
    <CaretDownIcon
      aria-hidden
      className="ml-auto size-5 text-primary transition-transform group-open:rotate-180"
    />
  </summary>
  <div className="px-5 pb-4 font-mono text-sm">…</div>
</details>
```

---

## 7. Do / Don't

| Do | Don't |
| --- | --- |
| `bg-background` page, `bg-card` surfaces | `bg-white`, `bg-gray-100`, `bg-[#f7f7f7]` |
| `text-foreground`; `text-muted-foreground` for captions | `text-gray-500`, `text-black/60` |
| `bg-primary text-primary-foreground`, hover `bg-dark-blue` | `bg-blue-600`, gradients, `hover:opacity-80` |
| `border border-border` | `shadow-lg`, `ring-1 ring-black/10` for separation |
| Square corners (the default) | `rounded-full` buttons, `rounded-2xl` cards |
| `font-mono uppercase tracking-widest` for labels | A third font, or `font-medium` on Grotesk |
| `h1`–`h4` + `text-header-*` | `text-[36px]`, `text-[22px]` |
| `Button`, `Card`, `Input`, `Label` from `@/components/ui` | Hand-rolled `<button className="…">` look-alikes |
| Phosphor `*Icon` components | `lucide-react`, inline SVG icons |

### 7.1 Self-check before you finish

1. No hex/rgb/oklch literals and no arbitrary `[#…]` colours.
2. No Tailwind default-palette classes (`gray-*`, `blue-*`, `white`, …).
3. No `dark:` variants added.
4. Grotesk text uses only `font-normal` or `font-bold`; labels and buttons are `font-mono`.
5. Headings use `h1`–`h4` and the `text-header-*` scale.
6. There is at most one `primary` CTA per view, and light text appears only on dark fills
   (§2.3).
7. No rounded corners or shadows were added; surfaces are separated with `border-border`.
8. Existing `components/ui` primitives are used before anything new is built.
