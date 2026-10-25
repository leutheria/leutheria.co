import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LegalPage } from '@/components/legal/legal-page'
import { internalLink } from '@/components/legal/rich-text'
import { analyticsHost, company } from '@/config/company'
import type { Locale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/metadata'

/** Bump this whenever the wording below, or the cookies the site sets, change. */
const COOKIES_UPDATED_ON = new Date('2026-10-24T00:00:00Z')

/**
 * Every cookie the site sets. Today only next-intl's locale cookie, written by
 * `src/proxy.ts` with the library defaults (no `maxAge`, so a session cookie).
 */
const COOKIES = [{ name: 'NEXT_LOCALE', key: 'nextLocale' }] as const

type PageProps = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Metadata.cookies' })

    return {
        title: t('title'),
        description: t('description'),
        alternates: buildAlternates('/cookies', locale),
        robots: { index: false, follow: true },
    }
}

export default async function CookiesPage({ params }: PageProps) {
    const { locale } = await params
    setRequestLocale(locale)

    return <CookiesPolicy />
}

function CookiesPolicy() {
    const t = useTranslations('Cookies')

    return (
        <LegalPage
            current="/cookies"
            title={t('title')}
            lead={t('lead')}
            updatedOn={COOKIES_UPDATED_ON}
            sections={[
                {
                    id: 'summary',
                    title: t('summary.title'),
                    children: <p>{t('summary.body')}</p>,
                },
                {
                    id: 'cookies-used',
                    title: t('list.title'),
                    flush: <CookieTable />,
                },
                {
                    id: 'no-consent',
                    title: t('exempt.title'),
                    children: <p>{t('exempt.body')}</p>,
                },
                {
                    id: 'third-parties',
                    title: t('thirdParties.title'),
                    children: (
                        <p>
                            {t.rich('thirdParties.body', {
                                analytics: company.analytics.name,
                                analyticsOperator: company.analytics.operator,
                                analyticsHost,
                                formProvider: company.formProvider.name,
                                privacy: internalLink('/privacy-policy'),
                            })}
                        </p>
                    ),
                },
                {
                    id: 'managing-cookies',
                    title: t('manage.title'),
                    children: <p>{t('manage.body')}</p>,
                },
            ]}
        />
    )
}

/**
 * Runs edge to edge in its card. On phones, where four columns cannot fit, each
 * cookie becomes a stacked list instead of a table that scrolls sideways.
 */
function CookieTable() {
    const t = useTranslations('Cookies.list')
    const headers = [t('name'), t('purpose'), t('provider'), t('duration')]

    return (
        <>
            <ul className="border-t border-border sm:hidden">
                {COOKIES.map((cookie) => (
                    <li key={cookie.name} className="border-b border-border px-6 py-5 last:border-b-0">
                        <code className="rounded-md bg-accent-soft px-2 py-1 font-mono text-xs font-semibold text-accent">
                            {cookie.name}
                        </code>
                        <dl className="mt-4 grid gap-3 text-sm">
                            {(['purpose', 'provider', 'duration'] as const).map((field) => (
                                <div key={field}>
                                    <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                                        {t(field)}
                                    </dt>
                                    <dd className="mt-1 leading-relaxed text-foreground">
                                        {t(`${cookie.key}.${field}`)}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </li>
                ))}
            </ul>
            <CookieTableWide headers={headers} />
            <p className="border-t border-border px-6 py-5 text-sm leading-relaxed text-muted sm:px-8">{t('note')}</p>
        </>
    )
}

function CookieTableWide({ headers }: { headers: string[] }) {
    const t = useTranslations('Cookies.list')

    return (
        <div className="hidden overflow-x-auto border-t border-border sm:block">
            <table className="w-full min-w-xl border-collapse text-left text-sm">
                <caption className="sr-only">{t('caption')}</caption>
                <thead className="bg-surface">
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header}
                                scope="col"
                                className="px-6 py-3 text-xs font-semibold uppercase tracking-widest text-muted first:pl-6 sm:first:pl-8 last:pr-6 sm:last:pr-8"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {COOKIES.map((cookie) => (
                        <tr key={cookie.name} className="border-t border-border align-top">
                            <th scope="row" className="py-4 pr-6 pl-6 font-normal sm:pl-8">
                                <code className="rounded-md bg-accent-soft px-2 py-1 font-mono text-xs font-semibold text-accent">
                                    {cookie.name}
                                </code>
                            </th>
                            <td className="px-6 py-4 leading-relaxed text-muted">{t(`${cookie.key}.purpose`)}</td>
                            <td className="px-6 py-4 leading-relaxed text-muted">{t(`${cookie.key}.provider`)}</td>
                            <td className="py-4 pr-6 pl-6 leading-relaxed text-muted sm:pr-8">
                                {t(`${cookie.key}.duration`)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
