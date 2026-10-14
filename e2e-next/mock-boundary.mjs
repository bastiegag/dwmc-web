import { createServer } from 'node:http'

const port = Number(process.env.NEXT_TEST_MOCK_PORT ?? 8790)
const users = new Map([
    ['mock-token-alice', { id: 'user-alice', email: 'alice@example.com' }],
    ['mock-token-bob', { id: 'user-bob', email: 'bob@example.com' }],
])

const send = (response, status, body) => {
    response.writeHead(status, {
        'content-type': 'application/json',
        'access-control-allow-origin': 'http://127.0.0.1:5182',
        'access-control-allow-headers': '*',
        'access-control-allow-methods': 'GET, POST, PUT, OPTIONS',
        'access-control-allow-credentials': 'true',
    })
    response.end(body === undefined ? '' : JSON.stringify(body))
}

const readBody = async (request) => {
    const chunks = []
    for await (const chunk of request) chunks.push(chunk)
    return Buffer.concat(chunks).toString()
}

const getUser = (request) => users.get(request.headers.authorization?.replace('Bearer ', ''))

const server = createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`)

    if (request.method === 'OPTIONS') {
        send(response, 204)
        return
    }

    if (url.pathname === '/health') {
        send(response, 200, { ok: true })
        return
    }

    if (url.pathname === '/auth/v1/token' && request.method === 'POST') {
        const body = JSON.parse(await readBody(request))
        if (url.searchParams.get('grant_type') === 'password') {
            const email = body.email
            const user =
                email === 'bob@example.com'
                    ? users.get('mock-token-bob')
                    : users.get('mock-token-alice')
            send(response, 200, {
                access_token: user.id === 'user-bob' ? 'mock-token-bob' : 'mock-token-alice',
                refresh_token: `refresh-${user.id}`,
                token_type: 'bearer',
                expires_in: 3600,
                user,
            })
            return
        }
        send(response, 400, { error: 'invalid_grant', error_description: 'Invalid code' })
        return
    }

    if (url.pathname === '/auth/v1/signup' && request.method === 'POST') {
        const body = JSON.parse(await readBody(request))
        const user = { id: 'user-signup', email: body.email }
        send(response, 200, {
            access_token: 'mock-token-alice',
            refresh_token: 'refresh-user-signup',
            token_type: 'bearer',
            expires_in: 3600,
            user,
        })
        return
    }

    if (url.pathname === '/auth/v1/recover' && request.method === 'POST') {
        await readBody(request)
        send(response, 200, {})
        return
    }

    if (url.pathname === '/auth/v1/user' && request.method === 'GET') {
        const user = getUser(request)
        send(response, user ? 200 : 401, user ?? { error: 'invalid_token' })
        return
    }

    if (url.pathname === '/auth/v1/user' && request.method === 'PUT') {
        const user = getUser(request)
        await readBody(request)
        send(response, user ? 200 : 401, user ?? { error: 'invalid_token' })
        return
    }

    if (url.pathname === '/auth/v1/logout' && request.method === 'POST') {
        response.writeHead(204)
        response.end()
        return
    }

    if (url.pathname === '/api/v1/auth/me' && request.method === 'GET') {
        const user = getUser(request)
        if (!user) {
            send(response, 401, {
                error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' },
            })
            return
        }
        send(response, 200, {
            data: {
                user,
                profile: { id: `profile-${user.id}`, authUserId: user.id },
            },
        })
        return
    }

    send(response, 404, { error: { code: 'NOT_FOUND', message: 'Not found' } })
})

server.listen(port, '127.0.0.1')
