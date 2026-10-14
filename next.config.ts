import type { NextConfig } from 'next'

const apiBaseUrl = process.env.DWMC_API_URL ?? 'http://localhost:3000/api/v1'

const nextConfig: NextConfig = {
    agentRules: false,
    outputFileTracingRoot: import.meta.dirname,
    allowedDevOrigins: ['127.0.0.1'],
    env: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? '',
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    },
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
