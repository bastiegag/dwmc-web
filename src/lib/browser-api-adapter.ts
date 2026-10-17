export type BrowserApiAdapter = {
    baseUrl: string
    getAccessToken: () => Promise<string | undefined>
    onUnauthorized: () => Promise<void>
}

let configuredAdapter: BrowserApiAdapter | undefined

export const configureBrowserApiAdapter = (adapter: BrowserApiAdapter) => {
    if (!adapter.baseUrl) {
        throw new Error('Browser API base URL is not configured.')
    }

    configuredAdapter = {
        ...adapter,
        baseUrl: adapter.baseUrl.replace(/\/+$/, ''),
    }
}

export const getBrowserApiAdapter = (): BrowserApiAdapter => {
    if (!configuredAdapter) {
        throw new Error('Browser API adapter has not been configured.')
    }
    return configuredAdapter
}
