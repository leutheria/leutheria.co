import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/**
 * Baseline security headers. Vercel adds HSTS on custom domains, so it is not
 * repeated here; everything below also applies to `yarn dev` and `yarn start`.
 */
const securityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
]

const nextConfig: NextConfig = {
    poweredByHeader: false,
    reactStrictMode: true,
    async headers() {
        return [{ source: '/:path*', headers: securityHeaders }]
    },
    /**
     * The WordPress site had eight indexed URLs. Five are reproduced exactly by
     * the routing configuration (`/`, `/contact-us`, `/legal-mentions`, and the
     * `/fr` equivalents). The three below no longer exist as pages — the About
     * content is now part of the homepage, and `/fr/bonjour` was the leftover
     * WordPress sample post — so they are permanently redirected rather than
     * left to 404 and lose their inbound links.
     */
    async redirects() {
        return [
            { source: '/about', destination: '/', permanent: true },
            { source: '/fr/a-propos', destination: '/fr', permanent: true },
            { source: '/fr/bonjour', destination: '/fr', permanent: true },
        ]
    },
}

export default withNextIntl(nextConfig)
