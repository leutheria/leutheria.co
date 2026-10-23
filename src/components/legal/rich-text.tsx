import type { ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import type { AppPathname } from '@/i18n/routing'

/**
 * Tag renderers for `t.rich(...)` in the legal pages, so every link and emphasis
 * in the catalogues looks the same without repeating class strings.
 */
export const legalLinkClass =
    'font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent-hover hover:decoration-current'

export function strong(chunks: ReactNode) {
    return <strong className="font-semibold text-foreground">{chunks}</strong>
}

export function externalLink(href: string) {
    return (chunks: ReactNode) => (
        <a href={href} target="_blank" rel="noreferrer noopener" className={legalLinkClass}>
            {chunks}
        </a>
    )
}

export function mailLink(email: string) {
    return (chunks: ReactNode) => (
        <a href={`mailto:${email}`} className={legalLinkClass}>
            {chunks}
        </a>
    )
}

export function internalLink(href: AppPathname) {
    return (chunks: ReactNode) => (
        <Link href={href} className={legalLinkClass}>
            {chunks}
        </Link>
    )
}
