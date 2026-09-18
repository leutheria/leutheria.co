# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

The corporate website of **Leutheria** (SARL, RCS Paris, SIREN 891978819) — a French
supplier of office and administrative materials. Next.js 16 App Router, TypeScript,
Tailwind v4, bilingual EN/FR via next-intl, deployed on Vercel. It replaced a WordPress
(Roots Bedrock) install.

Read `README.md` first. The points below are the ones that are easy to get wrong.

## Conventions

- **Package manager is yarn.** Never npm or pnpm.
- **Formatting is Biome**, not ESLint: 4-space indent, 120 columns, single quotes,
  no semicolons, trailing commas `es5`. Run `yarn lint:fix` after editing.
  Prettier handles CSS / Markdown / YAML only.

## URL structure is inherited — treat it as fixed

English is the default locale and unprefixed; French is `/fr`. The per-locale pathname
spellings (`/contact-us`, `/fr/contactez-nous`, `/legal-mentions`, `/fr/mentions-legales`)
were inherited from the WordPress site so that indexed URLs survived the migration.
Changing them silently costs SEO. The retired URLs (`/about`, `/fr/a-propos`,
`/fr/bonjour`) are permanently redirected in `next.config.ts` — keep those redirects.

## i18n rules

- Every user-facing string lives in `messages/en.json` + `messages/fr.json`. Never
  hard-code copy in a component.
- Import navigation from `@/i18n/navigation`, never from `next/link` / `next/navigation`.
- Messages are ICU MessageFormat: use `’`, not `'` — a straight apostrophe silently
  escapes the rest of the message. Pass literal numbers (years) as strings, or ICU
  applies digit grouping.
- Adding a key means adding it to **both** catalogues; `scripts/check-messages.mjs`
  fails CI otherwise, and TypeScript types keys off `en.json` only.
- Adding a route means adding it to `pathnames` in `src/i18n/routing.ts`, creating the
  folder under `src/app/[locale]/` named after the **internal** path (the English
  spelling), and giving it `generateMetadata` with `buildAlternates(...)`.

## Company / legal data

`src/config/company.ts` is the single source of truth. Legal values come from the public
French registry — do not edit them from memory; re-check against
`https://recherche-entreprises.api.gouv.fr/search?q=891978819`. Prose about those facts
belongs in the message catalogues, not the config.

## Brand and colour

`src/app/globals.css` is the only place colours are defined. Never hard-code a hex in a
component. The palette derives from the logo: `--accent` is `#327571`, the mark's deepest
green. Every foreground/background pair must stay at WCAG AA — `yarn check:contrast`
enforces it.

The logo is inlined in `src/components/logo.tsx` from `Brand/logo-square.svg`, with the
Illustrator `<style>` classes resolved to literal `fill` attributes (global class names
inside an inline SVG collide). It needs no dark variant. If the logo is revised, re-inline
it there and regenerate `src/app/icon.svg`, `apple-icon.png` and `opengraph-image.png`.

## Contact form

Posts directly to Web3Forms from the browser — no API route, no server-side secret.
`NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is public by design. Validation rules live in
`src/lib/contact-form.ts` and return error _codes_ resolved against `Contact.errors.*`;
keep them locale-agnostic.
