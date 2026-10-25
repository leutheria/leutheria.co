/**
 * Single source of truth for Leutheria's legal and contact identity.
 *
 * Verified against the French public company registry (INSEE / RNE, exposed by
 * recherche-entreprises.api.gouv.fr) for SIREN 891978819. The intra-community
 * VAT number is derived from the SIREN with the standard French key algorithm:
 * key = (12 + 3 * (SIREN mod 97)) mod 97 -> 88.
 *
 * Keep this file locale-agnostic: it holds facts, not prose. Translated labels
 * live in `messages/{locale}.json`.
 */
export const company = {
    /** Brand spelling, used throughout the interface. */
    name: 'Leutheria',
    /** Registered name as filed with the RCS, used in the legal notice. */
    legalName: 'LEUTHERIA',
    legalForm: 'SARL',
    capital: '1 000 €',
    siren: '891 978 819',
    siret: '891 978 819 00011',
    rcsCity: 'Paris',
    vat: 'FR88891978819',
    /** NAF/APE 47.91A — "Vente à distance sur catalogue général". */
    ape: '47.91A',
    /** ISO date of incorporation, as recorded by the RNE. */
    incorporatedOn: '2020-12-04',
    foundedYear: 2020,
    address: {
        street: '15 rue des Halles',
        postalCode: '75001',
        city: 'Paris',
        country: 'France',
    },
    email: 'guillaume@leutheria.co',
    publicationDirector: 'Guillaume Sainthillier',
    facebookUrl: 'https://www.facebook.com/leutheriaFrance/',
    /** Required in French "mentions légales": identity of the hosting provider. */
    host: {
        name: 'Vercel Inc.',
        address: '440 N Barranca Avenue #4133, Covina, CA 91723',
        country: 'United States',
        /** ISO 3166 code, translated by `LegalPages.country` in the catalogues. */
        countryCode: 'US',
        url: 'https://vercel.com',
        privacyUrl: 'https://vercel.com/legal/privacy-policy',
    },
    /**
     * DNS of leutheria.co (`dig NS leutheria.co` -> *.ns.cloudflare.com). The A
     * records point straight at Vercel: Cloudflare resolves the name but neither
     * hosts nor proxies the site.
     */
    dnsProvider: {
        name: 'Cloudflare, Inc.',
        address: '101 Townsend Street, San Francisco, CA 94107',
        country: 'United States',
        countryCode: 'US',
        url: 'https://www.cloudflare.com',
    },
    /** Receives the contact form straight from the browser and forwards it by email. */
    formProvider: {
        name: 'Web3Forms',
        url: 'https://web3forms.com',
        privacyUrl: 'https://web3forms.com/privacy',
    },
    /** Hosts the mailbox the form lands in (`dig MX leutheria.co` -> aspmx.l.google.com). */
    mailProvider: {
        name: 'Google Workspace',
        url: 'https://workspace.google.com',
        privacyUrl: 'https://policies.google.com/privacy',
    },
    /**
     * Audience measurement: Umami, self-hosted by SILARHI on its own server (OVH, France). The script loads from a
     * subdomain of the site, proxied by `dnsProvider` (Cloudflare) to that server, which serves only the tracker and
     * its endpoint. Cookieless and writes nothing to the browser, but reads `localStorage['umami.disabled']` (its
     * opt-out switch) before every event: the privacy and cookies pages say so.
     */
    analytics: {
        name: 'Umami',
        operator: 'SILARHI',
        url: 'https://umami.is',
        scriptUrl: 'https://analytics.leutheria.co/script.js',
        websiteId: '18e509cf-cb2d-4b22-a5ac-6b8f5fed6d60',
    },
    siteUrl: 'https://leutheria.co',
} as const

export const formattedAddress = `${company.address.street}, ${company.address.postalCode} ${company.address.city}, ${company.address.country}`

/** Host the tracker loads from and reports to, as the legal pages name it. */
export const analyticsHost = new URL(company.analytics.scriptUrl).host
