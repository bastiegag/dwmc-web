const fallbackPath = '/dashboard'
const permittedPaths = new Set([
    '/dashboard',
    '/transactions',
    '/budgets',
    '/accounts',
    '/categories',
    '/tools',
    '/tools/profile',
    '/tools/settings',
])

export const getSafeAuthRedirect = (value: string | null, allowRecovery = false): string => {
    if (!value || value.includes('\\') || !value.startsWith('/') || value.startsWith('//')) {
        return fallbackPath
    }

    try {
        const parsed = new URL(value, 'https://dwmc.invalid')
        if (
            parsed.origin !== 'https://dwmc.invalid' ||
            (!permittedPaths.has(parsed.pathname) &&
                !(allowRecovery && parsed.pathname === '/reset-password'))
        ) {
            return fallbackPath
        }
        return `${parsed.pathname}${parsed.search}${parsed.hash}`
    } catch {
        return fallbackPath
    }
}

export const getSafeAuthCallbackDestination = (value: string | null, flow: string | null) => {
    const destination = getSafeAuthRedirect(value, flow === 'recovery')
    return destination === '/reset-password' && flow !== 'recovery' ? fallbackPath : destination
}

export { fallbackPath }
