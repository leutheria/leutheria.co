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
        url: 'https://vercel.com',
    },
    siteUrl: 'https://leutheria.co',
} as const

export const formattedAddress = `${company.address.street}, ${company.address.postalCode} ${company.address.city}, ${company.address.country}`
