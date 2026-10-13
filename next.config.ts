import type { NextConfig } from 'next'

const apiBaseUrl = process.env.DWMC_API_URL ?? 'http://localhost:3000/api/v1'

const nextConfig: NextConfig = {
    agentRules: false,
    outputFileTracingRoot: import.meta.dirname,
    turbopack: {
        root: import.meta.dirname,
    },
    rewrites: async () => [
        {
            source: '/api/v1/:path*',
            destination: `${apiBaseUrl}/:path*`,
        },
    ],
}

export default nextConfig
