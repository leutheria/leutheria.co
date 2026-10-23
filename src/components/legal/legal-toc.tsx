'use client'

import clsx from 'clsx'
import { useEffect, useState } from 'react'

/** Distance from the top of the viewport at which a section counts as current. */
const SPY_OFFSET = 128

export type LegalTocItem = { id: string; label: string; number?: string }

/**
 * "On this page" list with scrollspy: the section that has most recently
 * scrolled under the sticky header is marked current. Without JavaScript it is
 * still a plain list of anchors.
 */
export function LegalToc({ title, items }: { title: string; items: LegalTocItem[] }) {
    const [activeId, setActiveId] = useState(items[0]?.id)

    useEffect(() => {
        const sections = items
            .map((item) => document.getElementById(item.id))
            .filter((element): element is HTMLElement => element !== null)
        if (sections.length === 0) {
            return
        }

        let frame = 0
        const update = () => {
            frame = 0
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
            // The last section whose top has scrolled past the sticky header
            // (64px) plus some breathing room; the final one once at the bottom,
            // since a short last section can never reach the top of the screen.
            const current = atBottom
                ? sections[sections.length - 1]
                : sections.findLast((section) => section.getBoundingClientRect().top <= SPY_OFFSET)
            setActiveId(current?.id ?? sections[0].id)
        }
        const onScroll = () => {
            if (frame === 0) {
                frame = window.requestAnimationFrame(update)
            }
        }

        update()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)

        return () => {
            window.cancelAnimationFrame(frame)
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
        }
    }, [items])

    return (
        <nav aria-label={title} className="rounded-2xl border border-border bg-surface p-5">
            <p className="px-3 pb-3 font-display text-sm font-bold text-foreground">{title}</p>
            <ol className="flex flex-col gap-0.5">
                {items.map((item) => {
                    const isActive = item.id === activeId

                    return (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                aria-current={isActive ? 'location' : undefined}
                                className={clsx(
                                    'flex items-baseline gap-2.5 rounded-lg border-l-2 px-3 py-1.5 text-sm transition-colors',
                                    isActive
                                        ? 'border-accent bg-background font-medium text-foreground'
                                        : 'border-transparent text-muted hover:bg-background hover:text-foreground'
                                )}
                            >
                                {item.number && (
                                    <span
                                        className={clsx(
                                            'font-display text-xs font-bold tabular-nums',
                                            isActive ? 'text-accent' : 'text-muted'
                                        )}
                                    >
                                        {item.number}
                                    </span>
                                )}
                                <span>{item.label}</span>
                            </a>
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
