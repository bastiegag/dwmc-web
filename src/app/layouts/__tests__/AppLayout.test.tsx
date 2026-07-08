import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import { AppLayout } from '../AppLayout'

const mockLogout = vi.fn()
let mockIsLoggingOut = false

vi.mock('@/features/auth/hooks', () => ({
    useLogout: () => ({ logout: mockLogout, isPending: mockIsLoggingOut }),
}))

vi.mock('sonner', () => ({
    toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}))

vi.mock('@/components/layout/ThemeToggle', () => ({
    ThemeToggle: () => null,
}))

describe('AppLayout', () => {
    beforeEach(() => {
        mockLogout.mockReset()
        mockIsLoggingOut = false
    })

    it('renders the month navigator on dashboard routes', () => {
        render(<AppLayout />, { initialEntries: ['/dashboard'] })
        expect(screen.getByRole('status')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument()
    })

    it('hides the month navigator on routes that do not need it', () => {
        render(<AppLayout />, { initialEntries: ['/accounts'] })
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('calls logout when Sign out is clicked', async () => {
        mockLogout.mockResolvedValueOnce(undefined)
        const user = userEvent.setup()
        render(<AppLayout />)
        await user.click(screen.getByRole('button', { name: /sign out/i }))
        expect(mockLogout).toHaveBeenCalledOnce()
    })

    it('disables the Sign out button while logging out', async () => {
        mockIsLoggingOut = true
        render(<AppLayout />)
        expect(screen.getByRole('button', { name: /sign out/i })).toBeDisabled()
    })
})
