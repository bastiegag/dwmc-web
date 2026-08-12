import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:8787'
const timestamp = '2026-01-01T00:00:00.000Z'

let profile = {
    id: 'profile-1',
    authUserId: 'mock-user-id',
    firstName: 'Ada',
    lastName: 'Lovelace',
    displayName: 'Ada',
    preferredCurrency: 'CAD' as const,
    createdAt: timestamp,
    updatedAt: timestamp,
}

export const profileHandlers = [
    http.get(`${API_URL}/profile`, () => HttpResponse.json({ data: profile })),
    http.patch(`${API_URL}/profile`, async ({ request }) => {
        const body = (await request.json()) as Partial<typeof profile>
        profile = { ...profile, ...body, updatedAt: timestamp }
        return HttpResponse.json({ data: profile })
    }),
]
