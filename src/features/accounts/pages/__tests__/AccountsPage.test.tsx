import { beforeEach, describe, expect, it, vi } from 'vitest'
import { delay, http, HttpResponse } from 'msw'
import { render, screen } from '@/test/utils/render'
import { server } from '@/test/mocks/server'
import { AccountsPage } from '@/features/accounts/pages/AccountsPage'

const accountsUrl = 'http://localhost:8787/api/v1/accounts'

describe('AccountsPage', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('shows loading state while accounts are being fetched', async () => {
        server.use(
            http.get(accountsUrl, async () => {
                await delay(200)
                return HttpResponse.json({ data: [] })
            }),
        )

        render(<AccountsPage />)

        expect(screen.getByLabelText(/loading accounts/i)).toBeInTheDocument()
        expect(await screen.findByText(/no accounts yet/i)).toBeInTheDocument()
    })

    it('shows empty state when no accounts exist', async () => {
        server.use(http.get(accountsUrl, () => HttpResponse.json({ data: [] })))

        render(<AccountsPage />)

        expect(await screen.findByText(/no accounts yet/i)).toBeInTheDocument()
    })

    it('renders accounts from API response', async () => {
        server.use(
            http.get(accountsUrl, () =>
                HttpResponse.json({
                    data: [
                        {
                            id: 'a1',
                            name: 'Checking',
                            type: 'CHECKING',
                            startingBalance: 1250.75,
                            currentBalance: 1250.75,
                            goal: null,
                            color: '#3b82f6',
                            icon: 'wallet',
                            isArchived: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                    ],
                }),
            ),
        )

        render(<AccountsPage />)

        expect(await screen.findByText('Checking')).toBeInTheDocument()
        // match numeric portion allowing for non-breaking spaces and locale separators
        const matches = await screen.findAllByText(/1\s*250[.,]\s*75/)
        expect(matches.length).toBeGreaterThanOrEqual(1)
    })
})
