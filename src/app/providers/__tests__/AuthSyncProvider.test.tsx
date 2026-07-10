import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { AuthSyncProvider } from '@/app/providers'
import { authSessionQueryKey } from '@/features/auth/hooks/useAuth'
import { authService } from '@/features/auth/services/authService'
import type { Session, AuthChangeEvent } from '@supabase/supabase-js'

type AuthCallback = Parameters<typeof authService.onAuthStateChange>[0]
const mockUnsubscribe = vi.hoisted(() => vi.fn())

let capturedCallback: AuthCallback | null = null

const createAuthStateChangeResult = (
    cb: AuthCallback,
): ReturnType<typeof authService.onAuthStateChange> => {
    return {
        data: {
            subscription: { id: 'test-subscription', callback: cb, unsubscribe: mockUnsubscribe },
        },
    } as ReturnType<typeof authService.onAuthStateChange>
}

vi.mock('@/features/auth/services/authService', () => ({
    authService: {
        onAuthStateChange: vi.fn((cb: AuthCallback) => {
            capturedCallback = cb
            return createAuthStateChangeResult(cb)
        }),
        getSession: vi.fn().mockResolvedValue(null),
    },
}))

const createWrapper = (qc: QueryClient) => {
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={qc}>
            <AuthSyncProvider>{children}</AuthSyncProvider>
        </QueryClientProvider>
    )
}

describe('AuthSyncProvider', () => {
    beforeEach(() => {
        capturedCallback = null
        mockUnsubscribe.mockClear()
        vi.clearAllMocks()
    })

    it('registers an auth state listener on mount', () => {
        const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
        render(<div>child</div>, { wrapper: createWrapper(qc) })
        expect(authService.onAuthStateChange).toHaveBeenCalledOnce()
    })

    it('updates the query cache when the auth state callback fires with a session', async () => {
        const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
        render(<div>child</div>, { wrapper: createWrapper(qc) })

        const mockSession = {
            user: { id: 'u1', email: 'alice@example.com' },
            access_token: 'tok',
        } as unknown as Session

        await act(async () => {
            await capturedCallback?.('SIGNED_IN' as AuthChangeEvent, mockSession)
        })

        await waitFor(() => {
            const cached = qc.getQueryData<Session | null>(authSessionQueryKey)
            expect(cached?.user?.email).toBe('alice@example.com')
        })
    })

    it('clears the query cache entry when the callback fires with null', async () => {
        const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
        qc.setQueryData(authSessionQueryKey, { user: { id: 'u1' } })
        render(<div>child</div>, { wrapper: createWrapper(qc) })

        await act(async () => {
            await capturedCallback?.('SIGNED_OUT' as AuthChangeEvent, null)
        })

        await waitFor(() => {
            expect(qc.getQueryData(authSessionQueryKey)).toBeNull()
        })
    })

    it('unsubscribes on unmount', () => {
        const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
        const { unmount } = render(<div>child</div>, { wrapper: createWrapper(qc) })
        unmount()
        expect(mockUnsubscribe).toHaveBeenCalledOnce()
    })
})
