import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '@/features/auth/hooks/useAuth'

describe('useAuth', () => {
    it('starts with isLoading true', () => {
        const { result } = renderHook(() => useAuth())
        expect(result.current.isLoading).toBe(true)
    })

    it('resolves to unauthenticated state when there is no stored session', async () => {
        const { result } = renderHook(() => useAuth())
        await waitFor(() => expect(result.current.isLoading).toBe(false))
        expect(result.current.user).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
    })

    it('unmounting does not throw', async () => {
        const { unmount } = renderHook(() => useAuth())
        expect(() => unmount()).not.toThrow()
    })
})
