# FreshTerra Web — UI Kit

> Living document. Every primitive in `src/components/ui/` is documented here.
> Update when adding, modifying, or deprecating a component.
>
> **Seeded by:**
>
> - Coming Soon page (root `/`) — Figma frames `122:789` (desktop) and `122:809` (mWeb)
> - Notify form (`/notify`) — frames `122:882` (desktop) and `122:829` (mWeb)
> - Policy pages (`/privacy-policy`, `/terms`) — frames `117:515` / `117:756` (Privacy) and `117:633` / `117:877` (Terms)

---

## Design Tokens

All tokens live in [`src/styles/globals.css`](../src/styles/globals.css) under the Tailwind v4 `@theme {}` block. Reference them in CSS as `var(--color-brand-500)` or in Tailwind classes via the auto-generated utilities (`bg-brand-500`, `text-brand-500`).

### Colors

| Token                                                            | Value              | Source    | Usage                                                |
| ---------------------------------------------------------------- | ------------------ | --------- | ---------------------------------------------------- |
| `--color-brand-500`                                              | `#18532f`          | Figma     | Primary brand green — body buttons, CTA text         |
| `--color-brand-600`                                              | `#164c2b`          | Figma     | Marketing footer bg, button hover state              |
| `--color-brand-300`                                              | `#648c74`          | Figma     | Muted forest — policy footer links on light surfaces |
| `--color-brand-100`                                              | `#b7cabf`          | Figma     | Top border above MarketingFooter                     |
| `--color-accent-olive`                                           | `#4e7511`          | Figma     | "Fresh." word in tri-color headline                  |
| `--color-accent-terracotta`                                      | `#ac612d`          | Figma     | "Wholesome." word in tri-color headline              |
| `--color-beige-100`                                              | `#fcfaf5`          | Figma     | Button label on solid green                          |
| `--color-cream-50`                                               | `#fffef8`          | Figma     | Coming Soon page fallback bg (desktop)               |
| `--color-white-soft`                                             | `#fefefe`          | Figma     | Button surface + on-image text                       |
| `--color-gray-6`                                                 | `#f2f2f2`          | Figma     | Notify sidebar bg                                    |
| `--color-gray-50`                                                | `#f9fafb`          | Figma     | Marketing page bg / header gradient bottom           |
| `--color-gray-200`                                               | `#e5e7ea`          | Figma     | Policy card divider above "Last Updated"             |
| `--color-gray-divider`                                           | `#dfdfdf`          | Figma     | Mobile dot separator on Notify                       |
| `--color-header-tint`                                            | `#ecfcec`          | Figma     | Marketing header gradient top                        |
| `--color-text-primary`                                           | `#131927`          | Figma     | Policy body text + breadcrumb current page           |
| `--color-text-secondary`                                         | `#6d717f`          | Figma     | Breadcrumb home link / inactive nav                  |
| `--color-text-tertiary`                                          | `#9ea2ae`          | Figma     | "Last Updated" caption                               |
| `--color-input-border`                                           | `rgba(0,0,0,0.38)` | Figma     | Input outline (Material)                             |
| `--color-input-text`                                             | `rgba(0,0,0,0.87)` | Figma     | Input value text                                     |
| `--color-input-label`                                            | `rgba(0,0,0,0.6)`  | Figma     | Floating input label                                 |
| `--color-bg` / `--color-fg` / `--color-muted` / `--color-border` | OKLCH              | bootstrap | Default neutrals (non-brand surfaces)                |

### Typography

| Token            | Family                        | Loaded via                             | Used for                                       |
| ---------------- | ----------------------------- | -------------------------------------- | ---------------------------------------------- |
| `--font-display` | Playfair Display (Medium 500) | `next/font/google` in `app/layout.tsx` | Hero headlines (`<Heading variant="display">`) |
| `--font-sans`    | Manrope (400, 500, 700)       | `next/font/google` in `app/layout.tsx` | Body, buttons, footer (default)                |

### Spacing

Tailwind v4 default scale (4px base). No custom spacing tokens needed for this page.

### Radii

| Token          | Value            | Usage                                                          |
| -------------- | ---------------- | -------------------------------------------------------------- |
| `--radius-sm`  | `0.25rem` (4px)  | bootstrap default                                              |
| `--radius-md`  | `0.5rem` (8px)   | bootstrap default                                              |
| `--radius-lg`  | `0.75rem` (12px) | bootstrap default                                              |
| `rounded-full` | `9999px`         | Pill button (Figma `numeric-system/corner-radius/radius--xxl`) |

---

## Primitives — `src/components/ui/`

> All primitives below have shipped. New entries get added here when introduced — never document a primitive that doesn't exist yet.

### Body

**File:** `src/components/ui/Body.tsx` · **Test:** `src/components/ui/Body.test.tsx` · **Status:** ✅ Shipped

Paragraph primitive matching Figma's "Body 3" (Manrope 14px / line-height 1.2 / tracking 0.2px). Server Component.

| Prop        | Type           | Default | Description                            |
| ----------- | -------------- | ------- | -------------------------------------- |
| `as`        | element type   | `"p"`   | Render any HTML element                |
| `size`      | `"sm" \| "md"` | `"sm"`  | sm = 14px (Body 3), md = 16px (Body 2) |
| `className` | `string?`      | —       | Merged via `cn()`                      |

```tsx
<Body>Personal data is retained only as necessary.</Body>
```

---

### Breadcrumb

**File:** `src/components/ui/Breadcrumb.tsx` · **Test:** `src/components/ui/Breadcrumb.test.tsx` · **Status:** ✅ Shipped

Two-level breadcrumb (`Home › Current`). Server Component. Current label is `aria-current="page"`; separator is `aria-hidden`.

| Prop        | Type      | Default      |
| ----------- | --------- | ------------ |
| `current`   | `string`  | — (required) |
| `homeLabel` | `string?` | `"Home"`     |
| `className` | `string?` | —            |

```tsx
<Breadcrumb current="Privacy Policy" />
```

---

### Container

**File:** `src/components/ui/Container.tsx`
**Test:** `src/components/ui/Container.test.tsx`
**Status:** ✅ Shipped

Centred max-width wrapper. Server Component.

**Test checklist:**

- [ ] Renders children
- [ ] Applies `max-w` from the requested size variant
- [ ] Applies horizontal padding (default px-6 / md:px-8)
- [ ] Forwards `className` and merges with internal classes via `cn()`

| Prop        | Type                                     | Default | Description                                              |
| ----------- | ---------------------------------------- | ------- | -------------------------------------------------------- |
| `size`      | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'`  | Max-width preset (lg = 1280px ≈ Figma 1260px hero stack) |
| `className` | `string?`                                | —       | Additional classes                                       |
| `as`        | `keyof JSX.IntrinsicElements`            | `'div'` | Element to render                                        |

```tsx
<Container size="lg">{children}</Container>
```

---

### Heading

**File:** `src/components/ui/Heading.tsx`
**Test:** `src/components/ui/Heading.test.tsx`
**Status:** ✅ Shipped

Typographic primitive. Server Component.

**Test checklist:**

- [ ] Renders the right HTML element per `level` (`h1`–`h6`)
- [ ] `display` variant uses Playfair font + correct desktop/mobile sizes
- [ ] `level` and `variant` are independent (a display-styled `<h2>` is valid)
- [ ] Forwards `className`

| Prop        | Type                                | Default  | Description                         |
| ----------- | ----------------------------------- | -------- | ----------------------------------- |
| `level`     | `1 \| 2 \| 3 \| 4 \| 5 \| 6`        | `2`      | Renders `<h{level}>`                |
| `variant`   | `'display' \| 'h1' \| 'h2' \| 'h3'` | `'h2'`   | Visual styling (display = Playfair) |
| `align`     | `'left' \| 'center' \| 'right'`     | `'left'` | Text alignment                      |
| `className` | `string?`                           | —        | Additional classes                  |

```tsx
<Heading level={1} variant="display" align="center">
  Fresh. Wholesome. Gourmet.
</Heading>
```

---

### Logo

**File:** `src/components/ui/Logo.tsx`
**Test:** `src/components/ui/Logo.test.tsx`
**Status:** ✅ Shipped

FreshTerra wordmark. Wraps `next/image` with explicit dimensions to prevent CLS. Server Component.

**Test checklist:**

- [ ] Renders an `img` with width and height attributes set
- [ ] Has accessible alt text (`"FreshTerra"`)
- [ ] When `linkToHome` is true, wraps in `<Link href="/">` with accessible name "FreshTerra home"
- [ ] `priority` defaults to false (caller opts in for above-fold use)

| Prop         | Type      | Default | Description                               |
| ------------ | --------- | ------- | ----------------------------------------- |
| `width`      | `number`  | `277`   | Render width (px)                         |
| `height`     | `number`  | `96`    | Render height (px)                        |
| `priority`   | `boolean` | `false` | Pass to `next/image` for LCP-critical use |
| `linkToHome` | `boolean` | `false` | Wrap in a `<Link>` to `/`                 |
| `className`  | `string?` | —       | Additional classes                        |

```tsx
<Logo width={277} height={96} priority />
```

---

### Button

**File:** `src/components/ui/Button.tsx`
**Test:** `src/components/ui/Button.test.tsx`
**Status:** ✅ Shipped

Primary interactive primitive. Server Component (renders a native `<button>`); the parent wraps it in `'use client'` only when needed.

**Test checklist:**

- [ ] Renders `<button>` by default with `type="button"`
- [ ] Variant `primary` → green bg, white text (default app context)
- [ ] Variant `onImage` → white bg, brand-500 text (this page)
- [ ] Variant `ghost` → transparent bg
- [ ] `loading` sets `aria-busy="true"` and disables the button
- [ ] `disabled` is reflected on the underlying button
- [ ] `fullWidth` applies `w-full`
- [ ] Renders `asChild` correctly when wrapping a `<Link>`
- [ ] Forwards `onClick`, `type`, and other native props
- [ ] Visible focus ring (default browser outline NOT removed without replacement)

| Prop        | Type                                | Default     | Description                                      |
| ----------- | ----------------------------------- | ----------- | ------------------------------------------------ |
| `variant`   | `'primary' \| 'onImage' \| 'ghost'` | `'primary'` | Visual style                                     |
| `size`      | `'sm' \| 'md' \| 'lg'`              | `'lg'`      | Padding + font size (lg matches Figma 18px/56px) |
| `fullWidth` | `boolean`                           | `false`     | Stretch to container width                       |
| `loading`   | `boolean`                           | `false`     | Show spinner + set `aria-busy`                   |
| `disabled`  | `boolean`                           | `false`     | Native disabled                                  |
| `type`      | `'button' \| 'submit' \| 'reset'`   | `'button'`  | Native button type                               |
| `className` | `string?`                           | —           | Additional classes                               |
| `children`  | `ReactNode`                         | —           | Label                                            |

```tsx
<Button variant="onImage" size="lg" onClick={openModal}>
  Get Notified
</Button>
```

---

### Input

**File:** `src/components/ui/Input.tsx`
**Test:** `src/components/ui/Input.test.tsx`
**Status:** ✅ Shipped

Form text input. Server Component (the form wrapping it is `'use client'`).

**Test checklist:**

- [ ] Renders a `<label>` linked to `<input>` via `htmlFor` / `id`
- [ ] When `error` is provided, sets `aria-invalid="true"` and links to error element via `aria-describedby`
- [ ] Helper text linked via `aria-describedby` when no error
- [ ] Visible focus ring
- [ ] Forwards native input props (`type`, `placeholder`, `name`, `autoComplete`, etc.)
- [ ] `srOnlyLabel` visually hides the label but keeps it for assistive tech

| Prop          | Type      | Default | Description                                            |
| ------------- | --------- | ------- | ------------------------------------------------------ |
| `label`       | `string`  | —       | Required for a11y                                      |
| `srOnlyLabel` | `boolean` | `false` | Visually hide the label (for placeholder-only designs) |
| `error`       | `string?` | —       | Error message; sets `aria-invalid`                     |
| `helper`      | `string?` | —       | Helper text below input                                |
| `id`          | `string?` | auto    | Input id (auto-generated if omitted)                   |
| `className`   | `string?` | —       | Wrapper classes                                        |

```tsx
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  autoComplete="email"
  error={errors.email?.message}
/>
```

---

### Checkbox

**File:** `src/components/ui/Checkbox.tsx`
**Test:** `src/components/ui/Checkbox.test.tsx`
**Status:** ✅ Shipped

Radio-shaped (circular) consent checkbox to match Figma. Server Component.

| Prop                  | Type        | Default | Description                            |
| --------------------- | ----------- | ------- | -------------------------------------- |
| `label`               | `ReactNode` | —       | Required visible label                 |
| `error`               | `string?`   | —       | Error message; sets `aria-invalid`     |
| `id`                  | `string?`   | auto    | Input id                               |
| native checkbox props | …           | —       | Forwarded to `<input type="checkbox">` |

```tsx
<Checkbox
  label="I agree to receive marketing emails."
  {...register("consent")}
/>
```

---

---

## Layout chrome — `src/components/layout/`

### MarketingHeader

**File:** `src/components/layout/MarketingHeader.tsx` · **Test:** present · **Status:** ✅ Shipped

`<header role="banner">` with green-tint gradient bg and a small Logo (140×48 desktop / 32px tall on mobile) linked to `/`. Used by `(marketing)/layout.tsx`.

### MarketingFooter

**File:** `src/components/layout/MarketingFooter.tsx` · **Test:** present · **Status:** ✅ Shipped

`<footer role="contentinfo">` on `brand-600` with a `brand-100` top border. Renders `© {year} FreshTerra. All rights reserved.` and the `comingSoonContent.policyLinks` items (Privacy Policy + Terms). Stacks on mobile, space-between on desktop.

---

## Page templates — `src/components/policy/`

### PolicyPage

**File:** `src/components/policy/PolicyPage.tsx` · **Test:** present · **Status:** ✅ Shipped

Full policy/legal page shell: gray-50 page bg → centered Container → Breadcrumb → Playfair `<h1>` (`policyTitle` variant) → white card with shadow containing the rendered intro + sections + "Last Updated" footer.

| Prop       | Type             | Description                                                       |
| ---------- | ---------------- | ----------------------------------------------------------------- |
| `document` | `PolicyDocument` | The full document — pages get this from `getPolicyDocument(slug)` |

### PolicySectionRenderer

**File:** `src/components/policy/PolicySectionRenderer.tsx` · **Test:** present · **Status:** ✅ Shipped

Renders a single `PolicySection` (heading + ordered blocks). Handles `paragraph` + `list` block types and bold spans (rendered as `<strong>`). Reused for the intro section by omitting the heading.

---

## Composite Components

### LeadCaptureForm

**File:** `src/components/coming-soon/LeadCaptureForm.tsx`
**Test:** `src/components/coming-soon/LeadCaptureForm.test.tsx`
**Status:** ✅ Shipped — used on `/notify`

> **Reusability note:** Lives under `coming-soon/` because the field set is page-specific (Phone + Email + marketing-consent for the launch list). When the homepage footer adds a newsletter signup, generalise this into `NewsletterSignup` — don't import from `coming-soon/` outside the temporary route.

Client Component (`'use client'`). Composes `Input` + `Checkbox` + `Button`. Submits to `/api/leads`.

| Prop           | Type      | Default     | Description                                                                                                         |
| -------------- | --------- | ----------- | ------------------------------------------------------------------------------------------------------------------- |
| `surfaceClass` | `string?` | `bg-gray-6` | Background of the parent surface — used for the floating-label punch-through (must match the parent `<aside>`'s bg) |
| `className`    | `string?` | —           | Additional classes on the `<form>`                                                                                  |

```tsx
<LeadCaptureForm surfaceClass="bg-gray-6" />
```

---

### PolicyLinks

**File:** `src/components/coming-soon/PolicyLinks.tsx`
**Test:** `src/components/coming-soon/PolicyLinks.test.tsx`
**Status:** ✅ Shipped — used on both `/` and `/notify`

The two policy links separated by a square dot, as in Figma. Server Component.

| Prop        | Type                   | Default     | Description                                                                                                              |
| ----------- | ---------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| `tone`      | `'onImage' \| 'muted'` | `'onImage'` | `onImage` = white text/dot for the hero overlay; `muted` = brand-300 text + gray dot for light surfaces (notify sidebar) |
| `size`      | `'sm' \| 'md'`         | `'md'`      | sm = 12px (mobile / Figma small); md = 16px (desktop)                                                                    |
| `className` | `string?`              | —           | Additional classes                                                                                                       |

---

## Component lifecycle

- `❌ Not started`
- `🔨 In progress`
- `🧪 Tests written`
- `✅ Shipped`

Update the status emoji on each component as it moves through.
