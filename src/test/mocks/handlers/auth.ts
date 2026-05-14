import { http, HttpResponse } from 'msw'

const SUPABASE_URL = 'https://test.supabase.co'

export const authHandlers = [
  http.post(`${SUPABASE_URL}/auth/v1/token`, async ({ request }) => {
    const url = new URL(request.url)
    const grantType = url.searchParams.get('grant_type')

    if (grantType === 'password') {
      const body = (await request.json()) as { email: string; password: string }
      if (body.email === 'test@example.com' && body.password === 'Password123') {
        return HttpResponse.json({
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          token_type: 'bearer',
          expires_in: 3600,
          user: {
            id: 'mock-user-id',
            email: 'test@example.com',
            created_at: new Date().toISOString(),
          },
        })
      }
      return HttpResponse.json(
        { error: 'invalid_grant', error_description: 'Invalid login credentials' },
        { status: 400 },
      )
    }
    return HttpResponse.json({ error: 'unsupported_grant_type' }, { status: 400 })
  }),

  http.post(`${SUPABASE_URL}/auth/v1/signup`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    if (body.email === 'existing@example.com') {
      return HttpResponse.json({ error: 'User already registered' }, { status: 422 })
    }
    return HttpResponse.json({
      id: 'new-user-id',
      email: body.email,
      created_at: new Date().toISOString(),
    })
  }),

  http.post(`${SUPABASE_URL}/auth/v1/recover`, () => HttpResponse.json({})),

  http.get(`${SUPABASE_URL}/auth/v1/user`, () =>
    HttpResponse.json({ message: 'JWT expired or invalid' }, { status: 401 }),
  ),
]
