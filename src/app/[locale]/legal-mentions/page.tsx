import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LegalFacts, LegalIdentityHeading, LegalPage } from '@/components/legal/legal-page'
import { externalLink, internalLink, legalLinkClass, strong } from '@/components/legal/rich-text'
import { company, formattedAddress } from '@/config/company'
import type { Locale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/metadata'

/** Bump this whenever the wording below changes. */
const LEGAL_UPDATED_ON = new Date('2026-10-27T00:00:00Z')

type PageProps = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Metadata.legal' })

    return {
        title: t('title'),
        description: t('description'),
        alternates: buildAlternates('/legal-mentions', locale),
        // A legal notice has no search value and should not compete with real pages.
        robots: { index: false, follow: true },
    }
}

export default async function LegalMentionsPage({ params }: PageProps) {
    const { locale } = await params
    setRequestLocale(locale)

    return <LegalMentions />
}

function LegalMentions() {
    const t = useTranslations('Legal')
    const tShared = useTranslations('LegalPages')

    return (
        <LegalPage
            current="/legal-mentions"
            title={t('title')}
            lead={t('lead')}
            updatedOn={LEGAL_UPDATED_ON}
            identity={{ id: 'publisher', title: t('identity.title'), content: <Identity /> }}
            sections={[
                {
                    id: 'hosting',
                    title: t('host.title'),
                    children: (
                        <>
                            <p>
                                {t.rich('host.body', {
                                    name: company.host.name,
                                    address: company.host.address,
                                    country: tShared('country', { code: company.host.countryCode }),
                                    url: company.host.url.replace('https://', ''),
                                    strong,
                                    link: externalLink(company.host.url),
                                })}
                            </p>
                            <p>{t('host.cdn')}</p>
                        </>
                    ),
                },
                {
                    id: 'domain-name',
                    title: t('dns.title'),
                    children: (
                        <p>
                            {t.rich('dns.body', {
                                name: company.dnsProvider.name,
                                address: company.dnsProvider.address,
                                country: tShared('country', { code: company.dnsProvider.countryCode }),
                                url: company.dnsProvider.url.replace('https://', ''),
                                strong,
                                link: externalLink(company.dnsProvider.url),
                            })}
                        </p>
                    ),
                },
                {
                    id: 'intellectual-property',
                    title: t('intellectualProperty.title'),
                    children: <p>{t('intellectualProperty.body', { company: company.name })}</p>,
                },
                {
                    id: 'terms-of-sale',
                    title: t('terms.title'),
                    children: <p>{t('terms.body', { company: company.name })}</p>,
                },
                {
                    id: 'liability',
                    title: t('liability.title'),
                    children: <p>{t('liability.body', { company: company.name })}</p>,
                },
                {
                    id: 'personal-data',
                    title: t('personalData.title'),
                    children: (
                        <p>
                            {t.rich('personalData.body', {
                                company: company.name,
                                privacy: internalLink('/privacy-policy'),
                                cookies: internalLink('/cookies'),
                            })}
                        </p>
                    ),
                },
            ]}
        />
    )
}

function Identity() {
    const t = useTranslations('Legal.identity')

    const rows = [
        { label: t('nameLabel'), value: <span className="font-semibold">{company.legalName}</span> },
        { label: t('formLabel'), value: t('formValue') },
        { label: t('capitalLabel'), value: company.capital },
        { label: t('addressLabel'), value: formattedAddress },
        { label: t('rcsLabel'), value: t('rcsValue', { city: company.rcsCity, siren: company.siren }) },
        { label: t('siretLabel'), value: company.siret },
        { label: t('vatLabel'), value: company.vat },
        { label: t('apeLabel'), value: t('apeValue', { code: company.ape }) },
        { label: t('directorLabel'), value: t('directorValue', { name: company.publicationDirector }) },
        {
            label: t('emailLabel'),
            value: (
                <a href={`mailto:${company.email}`} className={legalLinkClass}>
                    {company.email}
                </a>
            ),
        },
    ]

    return (
        <>
            <LegalIdentityHeading id="publisher" title={t('title')} badge={t('badge')} />
            <div className="mt-6">
                <LegalFacts rows={rows} columns={2} />
            </div>
        </>
    )
}
