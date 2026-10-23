import { notFound } from 'next/navigation'

/**
 * Unknown URLs would otherwise skip `[locale]/not-found.tsx` and fall through to
 * Next.js' bare, untranslated 404. Catching them here renders the localized one,
 * inside the site layout and with its own title.
 */
export default function CatchAllPage() {
    notFound()
}
