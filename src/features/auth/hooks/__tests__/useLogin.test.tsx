import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { renderHookWithQuery } from '@/test/utils/render'

vi.mock('sonner', () => ({
    toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}))

describe('useLogin', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('exposes login function and isPending: false initially', () => {
        const { result } = renderHookWithQuery(() => useLogin())
        expect(typeof result.current.login).toBe('function')
        expect(result.current.isPending).toBe(false)
    })

    it('resolves for valid credentials', async () => {
        const { result } = renderHookWithQuery(() => useLogin())
        await expect(
            result.current.login({ email: 'test@example.com', password: 'Password123' }),
        ).resolves.toBeDefined()
    })

    it('rejects for invalid credentials', async () => {
        const { result } = renderHookWithQuery(() => useLogin())
        await expect(
            result.current.login({ email: 'test@example.com', password: 'wrongpassword' }),
        ).rejects.toThrow()
    })
})
