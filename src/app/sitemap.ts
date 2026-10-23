import type { MetadataRoute } from 'next'
import { type AppPathname, routing } from '@/i18n/routing'
import { absoluteUrl } from '@/lib/metadata'

/** The legal pages are intentionally left out: they are served `noindex`. */
const INDEXABLE_PAGES: AppPathname[] = ['/', '/contact']

/**
 * Date the indexable pages last changed. Fixed rather than `new Date()`, which
 * would claim every page changed on each build; bump it when their copy changes.
 */
const CONTENT_UPDATED_ON = new Date('2026-10-23T00:00:00Z')

export default function sitemap(): MetadataRoute.Sitemap {
    return INDEXABLE_PAGES.map((href) => ({
        url: absoluteUrl(href, routing.defaultLocale),
        lastModified: CONTENT_UPDATED_ON,
        alternates: {
            languages: Object.fromEntries(routing.locales.map((locale) => [locale, absoluteUrl(href, locale)])),
        },
    }))
}
