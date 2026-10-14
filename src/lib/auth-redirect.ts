const fallbackPath = '/protected-proof'
const permittedPaths = new Set(['/protected-proof', '/reset-password'])

export const getSafeAuthRedirect = (value: string | null): string => {
    if (!value || value.includes('\\') || !value.startsWith('/') || value.startsWith('//')) {
        return fallbackPath
    }

    try {
        const parsed = new URL(value, 'https://dwmc.invalid')
        if (parsed.origin !== 'https://dwmc.invalid' || !permittedPaths.has(parsed.pathname)) {
            return fallbackPath
        }
        return `${parsed.pathname}${parsed.search}${parsed.hash}`
    } catch {
        return fallbackPath
    }
}

export const getSafeAuthCallbackDestination = (value: string | null, flow: string | null) => {
    const destination = getSafeAuthRedirect(value)
    return destination === '/reset-password' && flow !== 'recovery' ? fallbackPath : destination
}

export { fallbackPath }
