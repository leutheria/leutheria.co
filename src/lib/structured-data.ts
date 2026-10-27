import { company } from '@/config/company'

/** schema.org `Organization` for the home page, built only from `company.ts` plus the localized description. */
export function organizationJsonLd(description: string) {
    const siren = company.siren.replace(/\s/g, '')

    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${company.siteUrl}/#organization`,
        name: company.name,
        legalName: company.legalName,
        url: company.siteUrl,
        logo: `${company.siteUrl}/apple-icon.png`,
        description,
        email: company.email,
        foundingDate: company.incorporatedOn,
        vatID: company.vat,
        identifier: { '@type': 'PropertyValue', propertyID: 'SIREN', value: siren },
        address: {
            '@type': 'PostalAddress',
            streetAddress: company.address.street,
            postalCode: company.address.postalCode,
            addressLocality: company.address.city,
            addressCountry: 'FR',
        },
        sameAs: [company.facebookUrl, company.linkedinUrl],
    }
}

/** Serialises JSON-LD for a `<script>` tag; escaping `<` keeps a value from closing the tag early. */
export function serializeJsonLd(data: object) {
    return JSON.stringify(data).replace(/</g, '\\u003c')
}
