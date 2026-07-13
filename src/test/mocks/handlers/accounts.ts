import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:8787'

export const accountHandlers = [
    http.get(`${API_URL}/accounts`, () => HttpResponse.json({ data: [] })),

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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        return HttpResponse.json({ data: updated })
    }),

    http.delete(`${API_URL}/accounts/:id`, () => new HttpResponse(null, { status: 204 })),
]
