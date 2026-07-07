import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/render'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'

describe('DashboardPage', () => {
    beforeEach(() => {
        // Ensure apiClient uses the test API URL that MSW uses
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('renders heading and loading state', () => {
        render(<DashboardPage />)
        expect(screen.getByRole('heading', { name: /dashboard/i, level: 1 })).toBeInTheDocument()
        expect(screen.getByLabelText(/loading summary/i)).toBeInTheDocument()
    })

    it('shows summary cards when data is present', async () => {
        render(<DashboardPage />)
        expect(
            await screen.findByRole('heading', { name: /income/i, level: 2 }),
        ).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /expenses/i, level: 2 })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /net/i, level: 2 })).toBeInTheDocument()
    })
})
