import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'
import { LegalFacts, LegalPage } from '@/components/legal/legal-page'
import { externalLink, internalLink, mailLink, strong } from '@/components/legal/rich-text'
import { company, formattedAddress } from '@/config/company'
import type { Locale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/metadata'

/** Bump this whenever the wording below, or a provider it names, changes. */
const PRIVACY_UPDATED_ON = new Date('2026-10-23T00:00:00Z')

const CNIL_COMPLAINT_URL = 'https://www.cnil.fr/fr/plaintes'
const DPF_URL = 'https://www.dataprivacyframework.gov/list'

/** GDPR rights, in the order of Articles 15 to 21, then the French post-mortem right. */
const RIGHTS = ['access', 'rectification', 'erasure', 'restriction', 'objection', 'portability', 'postMortem'] as const

type PageProps = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Metadata.privacy' })

    return {
        title: t('title'),
        description: t('description'),
        alternates: buildAlternates('/privacy-policy', locale),
        // Like the legal notice: required reading, not a landing page.
        robots: { index: false, follow: true },
    }
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
    const { locale } = await params
    setRequestLocale(locale)

    return <PrivacyPolicy />
}

function PrivacyPolicy() {
    const t = useTranslations('Privacy')

    const providers = {
        company: company.name,
        host: company.host.name,
        formProvider: company.formProvider.name,
        mailProvider: company.mailProvider.name,
        analytics: company.analytics.name,
        analyticsOperator: company.analytics.operator,
    }

    return (
        <LegalPage
            current="/privacy-policy"
            title={t('title')}
            lead={t('lead')}
            updatedOn={PRIVACY_UPDATED_ON}
            sections={[
                {
                    id: 'controller',
                    title: t('controller.title'),
                    children: (
                        <>
                            <p>
                                {t.rich('controller.body', {
                                    legalName: company.legalName,
                                    legalForm: company.legalForm,
                                    address: formattedAddress,
                                    rcsCity: company.rcsCity,
                                    siren: company.siren,
                                    strong,
                                })}
                            </p>
                            <p>
                                {t.rich('controller.contact', {
                                    email: company.email,
                                    mailto: mailLink(company.email),
                                })}
                            </p>
                        </>
                    ),
                },
                {
                    id: 'contact-form',
                    title: t('contactForm.title'),
                    children: (
                        <>
                            <p>{t.rich('contactForm.intro', { contact: internalLink('/contact') })}</p>
                            <ProcessingFacts
                                data={t('contactForm.data', providers)}
                                purpose={t('contactForm.purpose')}
                                legalBasis={t('contactForm.legalBasis', providers)}
                                recipients={t.rich('contactForm.recipients', {
                                    ...providers,
                                    form: externalLink(company.formProvider.url),
                                    mail: externalLink(company.mailProvider.url),
                                })}
                                retention={t('contactForm.retention')}
                            />
                            <p>
                                {t.rich('contactForm.providerNote', {
                                    ...providers,
                                    policy: externalLink(company.formProvider.privacyUrl),
                                })}
                            </p>
                        </>
                    ),
                },
                {
                    id: 'hosting-logs',
                    title: t('hosting.title'),
                    children: (
                        <>
                            <p>{t('hosting.intro', providers)}</p>
                            <ProcessingFacts
                                data={t('hosting.data')}
                                purpose={t('hosting.purpose')}
                                legalBasis={t('hosting.legalBasis', providers)}
                                recipients={t.rich('hosting.recipients', {
                                    ...providers,
                                    hostLink: externalLink(company.host.url),
                                })}
                                retention={t.rich('hosting.retention', {
                                    policy: externalLink(company.host.privacyUrl),
                                })}
                            />
                        </>
                    ),
                },
                {
                    id: 'audience',
                    title: t('audience.title'),
                    children: (
                        <>
                            <p>{t('audience.intro', providers)}</p>
                            <ProcessingFacts
                                data={t('audience.data')}
                                purpose={t('audience.purpose')}
                                legalBasis={t('audience.legalBasis', providers)}
                                recipients={t.rich('audience.recipients', {
                                    ...providers,
                                    umami: externalLink(company.analytics.url),
                                })}
                                retention={t('audience.retention')}
                            />
                        </>
                    ),
                },
                {
                    id: 'transfers',
                    title: t('transfers.title'),
                    children: (
                        <>
                            <p>{t('transfers.body', providers)}</p>
                            <p>{t.rich('transfers.check', { dpf: externalLink(DPF_URL) })}</p>
                        </>
                    ),
                },
                {
                    id: 'your-rights',
                    title: t('rights.title'),
                    children: (
                        <>
                            <p>{t('rights.intro')}</p>
                            <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-accent">
                                {RIGHTS.map((right) => (
                                    <li key={right}>{t.rich(`rights.${right}`, { strong })}</li>
                                ))}
                            </ul>
                            <p>
                                {t.rich('rights.exercise', {
                                    ...providers,
                                    email: company.email,
                                    mailto: mailLink(company.email),
                                })}
                            </p>
                        </>
                    ),
                },
                {
                    id: 'complaints',
                    title: t('complaint.title'),
                    children: <p>{t.rich('complaint.body', { cnil: externalLink(CNIL_COMPLAINT_URL) })}</p>,
                },
                {
                    id: 'security',
                    title: t('security.title'),
                    children: (
                        <>
                            <p>{t('security.body', providers)}</p>
                            <p>{t('security.breach', providers)}</p>
                        </>
                    ),
                },
                {
                    id: 'no-sale',
                    title: t('noSale.title'),
                    children: <p>{t('noSale.body', providers)}</p>,
                },
                {
                    id: 'changes',
                    title: t('changes.title'),
                    children: <p>{t.rich('changes.body', { cookies: internalLink('/cookies') })}</p>,
                },
            ]}
        />
    )
}

type ProcessingFactsProps = {
    data: ReactNode
    purpose: ReactNode
    legalBasis: ReactNode
    recipients: ReactNode
    retention: ReactNode
}

/** One processing operation, described with the five facts Article 13 GDPR asks for. */
function ProcessingFacts({ data, purpose, legalBasis, recipients, retention }: ProcessingFactsProps) {
    const t = useTranslations('Privacy.labels')

    return (
        <LegalFacts
            rows={[
                { label: t('data'), value: data },
                { label: t('purpose'), value: purpose },
                { label: t('legalBasis'), value: legalBasis },
                { label: t('recipients'), value: recipients },
                { label: t('retention'), value: retention },
            ]}
        />
    )
}
