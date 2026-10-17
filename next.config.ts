import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    agentRules: false,
    outputFileTracingRoot: import.meta.dirname,
    allowedDevOrigins: ['127.0.0.1'],
    turbopack: {
        root: import.meta.dirname,
    },
    rewrites: async () => [
        {
            source: '/api/v1/:path*',
            destination: `${getRequiredEnv('DWMC_API_URL')}/:path*`,
        },
    ],
}

function getRequiredEnv(name: string) {
    const value = process.env[name]
    if (!value) throw new Error(`${name} must be configured before starting Next.js.`)
    return value.replace(/\/+$/, '')
}

export default nextConfig
