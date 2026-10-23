import clsx from 'clsx'
import { useFormatter, useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import { Container } from '@/components/container'
import { Link } from '@/i18n/navigation'
import { LegalToc, type LegalTocItem } from './legal-toc'

/** The legal documents, in tab order. Each is a route in `pathnames`. */
const LEGAL_PAGES = [
    { href: '/legal-mentions', label: 'legal' },
    { href: '/privacy-policy', label: 'privacy' },
    { href: '/cookies', label: 'cookies' },
] as const

export type LegalHref = (typeof LEGAL_PAGES)[number]['href']

export type LegalSection = {
    /** Anchor of the section, also listed in the table of contents. */
    id: string
    title: string
    children?: ReactNode
    /** Content that runs edge to edge (a table) handles its own padding. */
    flush?: ReactNode
}

type LegalPageProps = {
    current: LegalHref
    title: string
    lead: string
    updatedOn: Date
    sections: LegalSection[]
    /** Unnumbered card shown before the sections: the identity block of the legal notice. */
    identity?: { id: string; title: string; content: ReactNode }
}

/**
 * Shared shell of the legal pages: breadcrumb, eyebrow, title, lead and date,
 * tabs between the documents, then one numbered card per section next to a
 * sticky table of contents.
 */
export function LegalPage({ current, title, lead, updatedOn, sections, identity }: LegalPageProps) {
    const t = useTranslations('LegalPages')
    const tNav = useTranslations('Nav')
    const format = useFormatter()

    const tocItems: LegalTocItem[] = [
        ...(identity ? [{ id: identity.id, label: identity.title }] : []),
        ...sections.map((section, index) => ({ id: section.id, label: section.title, number: sectionNumber(index) })),
    ]
    const currentLabel = LEGAL_PAGES.find((page) => page.href === current)?.label ?? 'legal'

    return (
        <>
            <section className="relative overflow-hidden border-b border-border">
                {/* Same soft wash as the home hero; purely decorative. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_20%_0%,var(--accent-soft),transparent_70%)]"
                />
                <Container className="relative pt-8 pb-10 sm:pb-12">
                    <nav aria-label={t('breadcrumbLabel')}>
                        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
                            <li>
                                <Link href="/" className="transition-colors hover:text-accent">
                                    {t('breadcrumbHome')}
                                </Link>
                            </li>
                            <li aria-hidden="true">/</li>
                            <li>{t('breadcrumbSection')}</li>
                            <li aria-hidden="true">/</li>
                            <li aria-current="page" className="font-medium text-foreground">
                                {tNav(currentLabel)}
                            </li>
                        </ol>
                    </nav>

                    <div className="mt-10 max-w-3xl">
                        <p className="inline-flex rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
                            {t('eyebrow')}
                        </p>
                        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                            {title}
                        </h1>
                        <p className="mt-5 text-lg leading-relaxed text-muted">{lead}</p>
                        <p className="mt-4 text-sm text-muted">
                            {t('updatedOn', { date: format.dateTime(updatedOn, { dateStyle: 'long' }) })}
                        </p>
                    </div>

                    <nav aria-label={t('tabsLabel')} className="mt-10">
                        <ul className="flex flex-wrap gap-2">
                            {LEGAL_PAGES.map((page) => {
                                const isCurrent = page.href === current

                                return (
                                    <li key={page.href}>
                                        <Link
                                            href={page.href}
                                            aria-current={isCurrent ? 'page' : undefined}
                                            className={clsx(
                                                'inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                                                isCurrent
                                                    ? 'border-accent bg-accent text-accent-foreground'
                                                    : 'border-border bg-background text-foreground hover:border-accent hover:text-accent'
                                            )}
                                        >
                                            {tNav(page.label)}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>
                </Container>
            </section>

            <Container className="py-12 sm:py-16">
                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="flex min-w-0 flex-col gap-6 lg:col-span-8">
                        {identity && (
                            <section
                                id={identity.id}
                                aria-labelledby={`${identity.id}-title`}
                                className="scroll-mt-24 rounded-2xl border border-border bg-background p-6 sm:p-8"
                            >
                                {identity.content}
                            </section>
                        )}

                        {sections.map((section, index) => (
                            <section
                                key={section.id}
                                id={section.id}
                                aria-labelledby={`${section.id}-title`}
                                className="scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-background"
                            >
                                <div className="p-6 sm:p-8">
                                    <h2
                                        id={`${section.id}-title`}
                                        className="flex items-baseline gap-3 font-display text-xl font-bold tracking-tight text-foreground"
                                    >
                                        <span className="font-display text-sm font-bold tabular-nums text-accent">
                                            {sectionNumber(index)}
                                        </span>
                                        <span>{section.title}</span>
                                    </h2>
                                    {section.children && (
                                        <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-muted">
                                            {section.children}
                                        </div>
                                    )}
                                </div>
                                {section.flush}
                            </section>
                        ))}
                    </div>

                    <aside className="hidden lg:col-span-4 lg:block">
                        <div className="sticky top-24">
                            <LegalToc title={t('tocTitle')} items={tocItems} />
                        </div>
                    </aside>
                </div>
            </Container>
        </>
    )
}

/** Heading of the identity card, styled like a section heading but unnumbered. */
export function LegalIdentityHeading({ id, title, badge }: { id: string; title: string; badge: string }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id={`${id}-title`} className="font-display text-xl font-bold tracking-tight text-foreground">
                {title}
            </h2>
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
                {badge}
            </span>
        </div>
    )
}

/** Label / value rows used by the identity card and the processing blocks. */
export function LegalFacts({ rows, columns = 1 }: { rows: { label: string; value: ReactNode }[]; columns?: 1 | 2 }) {
    return (
        <dl className={clsx('grid gap-3', columns === 2 && 'sm:grid-cols-2')}>
            {rows.map((row) => (
                <div key={row.label} className="rounded-xl bg-surface p-4">
                    <dt className="text-xs font-semibold uppercase tracking-widest text-muted">{row.label}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-foreground">{row.value}</dd>
                </div>
            ))}
        </dl>
    )
}

function sectionNumber(index: number) {
    return String(index + 1).padStart(2, '0')
}
