import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:8787'
const TIMESTAMP = '2026-01-01T00:00:00.000Z'

const accounts = [
    {
        id: 'account-checking',
        name: 'Checking',
        type: 'CHECKING',
        startingBalance: 1000,
        currentBalance: 1000,
        goal: null,
        color: '#3b82f6',
        icon: 'wallet',
        isArchived: false,
        createdAt: TIMESTAMP,
        updatedAt: TIMESTAMP,
    },
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
        createdAt: TIMESTAMP,
        updatedAt: TIMESTAMP,
    },
]

export const accountHandlers = [
    http.get(`${API_URL}/accounts`, ({ request }) => {
        const url = new URL(request.url)
        const includeArchived = url.searchParams.get('includeArchived') === 'true'
        const type = url.searchParams.get('type')
        const data = accounts.filter(
            (account) =>
                (includeArchived || !account.isArchived) && (!type || account.type === type),
        )
        return HttpResponse.json({ data })
    }),

    http.post(`${API_URL}/accounts`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>
        const created = {
            id: 'account-1',
            name: (body.name as string) ?? 'New account',
            type: (body.type as string) ?? 'CHECKING',
            startingBalance: Number(body.startingBalance ?? 0),
            currentBalance: Number(body.startingBalance ?? 0),
            goal: body.goal ?? null,
            color: (body.color as string) ?? '#3b82f6',
            icon: (body.icon as string) ?? 'wallet',
            isArchived: false,
            createdAt: TIMESTAMP,
            updatedAt: TIMESTAMP,
        }

        return HttpResponse.json({ data: created }, { status: 201 })
    }),

    http.patch(`${API_URL}/accounts/:id`, async ({ request, params }) => {
        const id = params.id as string
        const body = (await request.json()) as Record<string, unknown>
        const updated = {
            id,
            name: (body.name as string) ?? `Account ${id}`,
            type: (body.type as string) ?? 'CHECKING',
            startingBalance: Number(body.startingBalance ?? 0),
            currentBalance: Number(body.startingBalance ?? 0),
            goal: body.goal ?? null,
            color: (body.color as string) ?? '#3b82f6',
            icon: (body.icon as string) ?? 'wallet',
            isArchived: body.isArchived ?? false,
            createdAt: TIMESTAMP,
            updatedAt: TIMESTAMP,
        }

        return HttpResponse.json({ data: updated })
    }),

    http.delete(`${API_URL}/accounts/:id`, ({ params }) =>
        HttpResponse.json({ data: { id: params.id, isArchived: true } }),
    ),
]
