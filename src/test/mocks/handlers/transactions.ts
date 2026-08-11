import { http, HttpResponse } from 'msw'
import type {
    CreateTransactionPayload,
    UpdateTransactionPayload,
} from '@/features/transactions/types/transaction.types'
import { createAccount } from '@/test/fixtures/domain'

const API_URL = 'http://localhost:8787'
const TIMESTAMP = '2026-01-01T00:00:00.000Z'

export const transactionHandlers = [
    http.get(`${API_URL}/transactions`, ({ request }) => {
        const url = new URL(request.url)
        const page = Number(url.searchParams.get('page') ?? 1)
        const pageSize = Number(url.searchParams.get('pageSize') ?? 25)
        return HttpResponse.json({
            data: [],
            meta: { page, pageSize, total: 0, totalPages: 0 },
        })
    }),

    http.get(`${API_URL}/transactions/:id`, ({ params }) => {
        const id = params.id as string
        const account = createAccount()
        const t = {
            id,
            type: 'EXPENSE',
            amount: 12.34,
            date: '2026-06-15',
            merchant: 'Mock merchant',
            note: null,
            accountId: 'a1',
            fromAccountId: null,
            toAccountId: null,
            categoryId: null,
            isArchived: false,
            createdAt: TIMESTAMP,
            updatedAt: TIMESTAMP,
            account: {
                id: account.id,
                name: account.name,
                color: account.color,
                icon: account.icon,
            },
        }
        return HttpResponse.json({ data: t })
    }),

    http.post(`${API_URL}/transactions`, async ({ request }) => {
        const body = (await request.json()) as CreateTransactionPayload
        const created = {
            id: 'transaction-created',
            ...body,
            isArchived: false,
            createdAt: TIMESTAMP,
            updatedAt: TIMESTAMP,
        }
        return HttpResponse.json({ data: created }, { status: 201 })
    }),

    http.patch(`${API_URL}/transactions/:id`, async ({ request, params }) => {
        const id = params.id as string
        const body = (await request.json()) as UpdateTransactionPayload
        const updated = {
            id,
            ...body,
            updatedAt: TIMESTAMP,
        }
        return HttpResponse.json({ data: updated })
    }),

    http.delete(`${API_URL}/transactions/:id`, () => new HttpResponse(null, { status: 204 })),
]
