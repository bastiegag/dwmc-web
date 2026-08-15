import { describe, expect, it } from 'vitest'

const API_URL = 'http://localhost:8787'

describe('MSW API contracts', () => {
    it('filters accounts and preserves the data envelope', async () => {
        const response = await fetch(`${API_URL}/accounts?includeArchived=true&type=SAVINGS`)
        const body = (await response.json()) as { data: Array<{ id: string; isArchived: boolean }> }

        expect(response.ok).toBe(true)
        expect(body).toEqual({
            data: [
                {
                    id: 'account-archived',
                    name: 'Archived account',
                    type: 'SAVINGS',
                    startingBalance: 500,
                    currentBalance: 500,
                    goal: null,
                    color: '#64748b',
                    icon: 'archive',
                    isArchived: true,
                    createdAt: '2026-01-01T00:00:00.000Z',
                    updatedAt: '2026-01-01T00:00:00.000Z',
                },
            ],
        })
    })

    it('filters budgets by month and category', async () => {
        const matchingResponse = await fetch(`${API_URL}/budgets?month=2026-06&categoryId=cat-1`)
        const matchingBody = (await matchingResponse.json()) as { data: Array<{ id: string }> }
        const nonMatchingResponse = await fetch(`${API_URL}/budgets?month=2026-05&categoryId=cat-1`)
        const nonMatchingBody = (await nonMatchingResponse.json()) as { data: unknown[] }

        expect(matchingBody.data).toHaveLength(1)
        expect(matchingBody.data[0]).toMatchObject({ id: 'budget-groceries' })
        expect(nonMatchingBody.data).toEqual([])
    })

    it('echoes transaction pagination in the meta envelope', async () => {
        const response = await fetch(`${API_URL}/transactions?page=2&pageSize=10`)
        const body = (await response.json()) as {
            data: unknown[]
            meta: { page: number; pageSize: number; total: number; totalPages: number }
        }

        expect(body).toEqual({
            data: [],
            meta: { page: 2, pageSize: 10, total: 0, totalPages: 0 },
        })
    })
})
