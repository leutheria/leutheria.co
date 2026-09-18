import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
    locales: ['en', 'fr'],
    /**
     * English is the default and unprefixed, French lives under `/fr`. This is
     * not a stylistic choice: it reproduces the URL structure the WordPress site
     * (Polylang) already had, so every indexed URL survives the rewrite.
     */
    defaultLocale: 'en',
    localePrefix: 'as-needed',
    /**
     * Internal path -> per-locale public path. The keys are what you pass to
     * `<Link href="...">` and must match the folder name under
     * `src/app/[locale]/`; the values are what visitors and Google see.
     * These spellings are inherited from the WordPress site — do not "tidy" them.
     */
    pathnames: {
        '/': '/',
        '/contact': {
            en: '/contact-us',
            fr: '/contactez-nous',
        },
        '/legal-mentions': {
            en: '/legal-mentions',
            fr: '/mentions-legales',
        },
    },
})

export type Locale = (typeof routing.locales)[number]
export type AppPathname = keyof typeof routing.pathnames
