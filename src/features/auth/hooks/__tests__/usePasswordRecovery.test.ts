import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { usePasswordRecovery } from '@/features/auth/hooks/usePasswordRecovery'

const mockUnsubscribe = vi.fn()

vi.mock('@/features/auth/services', () => ({
    authService: {
        onAuthStateChange: vi.fn(),
    },
}))

const getAuthService = async () => {
    const { authService } = await import('@/features/auth/services')
    return authService
}

/**
 * Calls the registered onAuthStateChange callback with the given event/session,
 * simulating a Supabase auth state change.
 */
const fireAuthEvent = async (event: string, session: Record<string, unknown> | null = null) => {
    const authService = await getAuthService()
    const registeredCallback = vi.mocked(authService.onAuthStateChange).mock.calls[0]?.[0]
    if (!registeredCallback) throw new Error('No onAuthStateChange callback registered')
    act(() => {
        registeredCallback(event as never, session as never)
    })
}

describe('usePasswordRecovery', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
        const authService = await getAuthService()
        vi.mocked(authService.onAuthStateChange).mockReturnValue({
            data: { subscription: { unsubscribe: mockUnsubscribe } },
        } as never)
    })

    it('starts with isLoading true and isValid false', () => {
        const { result } = renderHook(() => usePasswordRecovery())
        expect(result.current.isLoading).toBe(true)
        expect(result.current.isValid).toBe(false)
    })

    it('resolves to valid when PASSWORD_RECOVERY event fires', async () => {
        const { result } = renderHook(() => usePasswordRecovery())
        await fireAuthEvent('PASSWORD_RECOVERY', { user: { id: 'user-1' } })
        await waitFor(() => expect(result.current.isLoading).toBe(false))
        expect(result.current.isValid).toBe(true)
    })

    it('resolves to invalid when INITIAL_SESSION fires with null session', async () => {
        const { result } = renderHook(() => usePasswordRecovery())
        await fireAuthEvent('INITIAL_SESSION', null)
        await waitFor(() => expect(result.current.isLoading).toBe(false))
        expect(result.current.isValid).toBe(false)
    })

    it('resolves to invalid when INITIAL_SESSION fires with an existing session (not a recovery flow)', async () => {
        const { result } = renderHook(() => usePasswordRecovery())
        await fireAuthEvent('INITIAL_SESSION', { user: { id: 'user-1' } })
        await waitFor(() => expect(result.current.isLoading).toBe(false))
        expect(result.current.isValid).toBe(false)
    })

    it('unsubscribes on unmount', () => {
        const { unmount } = renderHook(() => usePasswordRecovery())
        unmount()
        expect(mockUnsubscribe).toHaveBeenCalledOnce()
    })
})
