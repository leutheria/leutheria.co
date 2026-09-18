# leutheria.co

Corporate website for **Leutheria** — a French supplier of office and administrative
materials (SARL, RCS Paris, APE 47.91A).

Bilingual (English / French) marketing site with a homepage, a contact form and a legal
notice. It replaces the previous WordPress (Roots Bedrock) installation.

## Stack

| Concern       | Choice                                      |
| ------------- | ------------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack)          |
| Language      | TypeScript (strict)                         |
| Styling       | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| i18n          | next-intl 4 (`en` default, `fr`)            |
| Contact form  | Web3Forms (no backend, no server secret)    |
| Lint / format | Biome (JS/TS/JSON) + Prettier (CSS/MD/YAML) |
| Hosting       | Vercel                                      |

## Getting started

```bash
yarn install
cp .env.example .env.local   # then fill in the Web3Forms key
yarn dev                     # http://localhost:3000
```

## Environment variables

| Variable                           | Required | Notes                                                                                                                                              |
| ---------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | yes      | Free key from [web3forms.com](https://web3forms.com), bound to `guillaume@leutheria.co`. Public by design — it only permits posting to that inbox. |

Without the key the contact page degrades to a `mailto:` link rather than rendering a
button that would silently fail.

> `NEXT_PUBLIC_*` values are inlined **at build time**. Setting the variable in the
> Vercel dashboard is enough for production, but an existing deployment must be rebuilt
> for a changed value to take effect.

## URL structure — inherited, not invented

English is the default locale and is served **unprefixed**; French lives under `/fr`.
That is the structure the WordPress site (Polylang) already had, so the rewrite keeps
every indexed URL:

| URL                    | Status                              |
| ---------------------- | ----------------------------------- |
| `/`                    | preserved                           |
| `/contact-us`          | preserved                           |
| `/legal-mentions`      | preserved                           |
| `/fr`                  | preserved                           |
| `/fr/contactez-nous`   | preserved                           |
| `/fr/mentions-legales` | preserved                           |
| `/about`               | 308 → `/` (now a homepage section)  |
| `/fr/a-propos`         | 308 → `/fr`                         |
| `/fr/bonjour`          | 308 → `/fr` (WordPress sample post) |

The per-locale spellings live in `pathnames` in `src/i18n/routing.ts`; the redirects live
in `next.config.ts`. **Do not "tidy" either** — the spellings are load-bearing for SEO.

## Project structure

```
messages/               en.json / fr.json — every user-facing string
src/
  app/
    [locale]/           layout, home, contact, legal-mentions, not-found
    globals.css         Tailwind v4 theme tokens (light + dark)
    icon.svg            favicon
    robots.ts
    sitemap.ts
  components/           header, footer, locale switcher, contact form, primitives
  config/company.ts     single source of truth for legal + contact identity
  i18n/                 routing, navigation wrappers, per-request config
  lib/
    contact-form.ts     form validation rules (locale-agnostic error codes)
    metadata.ts         canonical + hreflang helpers
  proxy.ts              locale negotiation (Next 16 renamed `middleware` -> `proxy`)
scripts/
  check-messages.mjs    fails CI when en/fr catalogues drift apart
  check-contrast.mjs    fails CI when the palette drops below WCAG AA
```

## Internationalisation

- Always import `Link`, `redirect`, `usePathname` and `useRouter` from
  `@/i18n/navigation` — never from `next/link` or `next/navigation` — so the prefix and
  the localised pathnames are applied.
- Translation keys are type-checked against `messages/en.json` (see `global.d.ts`), and
  CI runs `scripts/check-messages.mjs` to keep `fr.json` in sync.
- Messages are parsed as ICU MessageFormat: use typographic apostrophes (`’`), never
  straight ones (`'`), which ICU treats as an escape character. Pass years and other
  literal numbers as **strings**, or ICU applies locale digit grouping (`2 020`).

## Legal data

`src/config/company.ts` is the only place company facts are stored. The values come from
the French public registry (INSEE / RNE) for SIREN **891978819**. The intra-community VAT
number is derived from the SIREN: `key = (12 + 3 × (SIREN mod 97)) mod 97`.

Update `LEGAL_UPDATED_ON` in `src/app/[locale]/legal-mentions/page.tsx` whenever the
wording of the notice changes.

## Brand

The logo is the source of the palette: `--accent` is `#327571`, the mark's deepest
colour and the only one of its three greens dark enough to carry text and button fills
at WCAG AA on white.

The mark lives **inline** in `src/components/logo.tsx`, vectorised from
`Brand/logo-square.svg`. Illustrator exported its fills as CSS classes in a `<style>`
block; inside an inline SVG those names are global and would collide, so they were
resolved to literal `fill` attributes. Because the mark carries its own colours and
reads on both backgrounds, there is no dark-mode variant to keep in sync.

| File                          | Purpose                                                                  |
| ----------------------------- | ------------------------------------------------------------------------ |
| `src/app/icon.svg`            | Favicon — the vector mark, crisp at every size                           |
| `src/app/apple-icon.png`      | iOS home screen; composited on white (iOS renders transparency as black) |
| `src/app/opengraph-image.png` | 1200×630 link-preview card                                               |
| `src/app/twitter-image.png`   | Same card, declared separately for X                                     |

`yarn check:contrast` parses the tokens out of `globals.css` and fails CI if any
foreground/background pair drops below WCAG AA (4.5:1).

## Scripts

```bash
yarn dev              # dev server
yarn build            # production build
yarn start            # serve the production build
yarn lint             # Biome check
yarn lint:fix         # Biome check --write
yarn typecheck        # tsc --noEmit
yarn check:messages   # en/fr catalogue parity
yarn check:contrast   # WCAG AA palette check
yarn lint-ci          # all of the above except the build
```

## Deployment

Hosted on Vercel. Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in **Settings → Environment
Variables**, then point the `leutheria.co` domain at Vercel. Pushes to `main` deploy to
production; pull requests get preview deployments.

`vercel.json` pins the build to the `cdg1` (Paris) region and uses a frozen-lockfile
install.
