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

const createDomainState = (user) => ({
    profile: {
        id: `profile-${user.id}`,
        authUserId: user.id,
        firstName: 'Ada',
        lastName: 'Lovelace',
        displayName: 'Ada',
        preferredCurrency: 'CAD',
    },
    accounts: [],
    sections: [],
    categories: [],
    transactions: [],
    budgets: [],
})

const domainStates = new Map()
const getDomainState = (request) => {
    const user = getUser(request)
    if (!user) return null
    if (!domainStates.has(user.id)) domainStates.set(user.id, createDomainState(user))
    return domainStates.get(user.id)
}

const now = () => '2026-06-01T00:00:00.000Z'
const readJson = async (request) => {
    const body = await readBody(request)
    return body ? JSON.parse(body) : {}
}
const active = (item, includeArchived) => includeArchived || !item.isArchived
const sectionWithCategories = (state, section) => ({
    ...section,
    categories: state.categories.filter(
        (category) => category.sectionId === section.id && !category.isArchived,
    ),
})

const handleDomainRequest = async (request, response, url) => {
    const state = getDomainState(request)
    if (!state) {
        send(response, 401, {
            error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' },
        })
        return true
    }

    const resourcePath = url.pathname.replace('/api/v1', '')
    const [resource, id] = resourcePath.split('/').filter(Boolean)
    const body = ['POST', 'PATCH', 'PUT'].includes(request.method) ? await readJson(request) : {}
    const includeArchived = url.searchParams.get('includeArchived') === 'true'

    if (resource === 'profile') {
        if (request.method === 'PATCH') Object.assign(state.profile, body)
        send(response, 200, { data: state.profile })
        return true
    }

    if (resource === 'accounts') {
        if (request.method === 'GET') {
            send(response, 200, {
                data: state.accounts
                    .filter((account) => active(account, includeArchived))
                    .map((account) => ({
                        ...account,
                        currentBalance:
                            account.startingBalance +
                            state.transactions.reduce((total, transaction) => {
                                if (transaction.isArchived || transaction.accountId !== account.id)
                                    return total
                                if (transaction.type === 'EXPENSE')
                                    return total - transaction.amount
                                if (['INCOME', 'ADJUSTMENT'].includes(transaction.type))
                                    return total + transaction.amount
                                return total
                            }, 0),
                    })),
            })
            return true
        }
        if (request.method === 'POST') {
            const account = {
                id: `account-${state.accounts.length + 1}`,
                ...body,
                startingBalance: Number(body.startingBalance ?? 0),
                currentBalance: Number(body.startingBalance ?? 0),
                isArchived: false,
                createdAt: now(),
                updatedAt: now(),
            }
            state.accounts.push(account)
            send(response, 201, { data: account })
            return true
        }
        const account = state.accounts.find((item) => item.id === id)
        if (!account) {
            send(response, 404, { error: { code: 'NOT_FOUND', message: 'Account not found' } })
            return true
        }
        if (request.method === 'PATCH') Object.assign(account, body, { updatedAt: now() })
        if (request.method === 'DELETE') account.isArchived = true
        send(response, 200, { data: account })
        return true
    }

    if (resource === 'sections' || resource === 'categories') {
        const collection = resource === 'sections' ? state.sections : state.categories
        if (request.method === 'GET') {
            const data =
                resource === 'sections'
                    ? collection
                          .filter((item) => active(item, includeArchived))
                          .map((section) => sectionWithCategories(state, section))
                    : collection.filter((item) => active(item, includeArchived))
            send(response, 200, { data, nextCursor: null })
            return true
        }
        if (request.method === 'POST') {
            const item = {
                id: `${resource === 'categories' ? 'category' : 'section'}-${collection.length + 1}`,
                ...body,
                isArchived: false,
                createdAt: now(),
                updatedAt: now(),
            }
            collection.push(item)
            send(response, 201, { data: item })
            return true
        }
        const item = collection.find((entry) => entry.id === id)
        if (!item) {
            send(response, 404, { error: { code: 'NOT_FOUND', message: 'Resource not found' } })
            return true
        }
        if (request.method === 'PATCH') Object.assign(item, body, { updatedAt: now() })
        if (request.method === 'DELETE') item.isArchived = true
        send(response, 200, { data: item })
        return true
    }

    if (resource === 'transactions') {
        if (request.method === 'GET') {
            const month = url.searchParams.get('month')
            const data = state.transactions.filter(
                (transaction) =>
                    active(transaction, includeArchived) &&
                    (!month || transaction.date.slice(0, 7) === month),
            )
            send(response, 200, {
                data,
                meta: {
                    page: 1,
                    pageSize: 20,
                    total: data.length,
                    totalPages: data.length ? 1 : 0,
                },
            })
            return true
        }
        if (request.method === 'POST') {
            const transaction = {
                id: `transaction-${state.transactions.length + 1}`,
                ...body,
                isArchived: false,
                createdAt: now(),
                updatedAt: now(),
            }
            state.transactions.push(transaction)
            send(response, 201, { data: transaction })
            return true
        }
        const transaction = state.transactions.find((item) => item.id === id)
        if (!transaction) {
            send(response, 404, { error: { code: 'NOT_FOUND', message: 'Transaction not found' } })
            return true
        }
        if (request.method === 'PATCH') Object.assign(transaction, body, { updatedAt: now() })
        if (request.method === 'DELETE') transaction.isArchived = true
        send(response, 200, { data: transaction })
        return true
    }

    if (resource === 'budgets') {
        if (request.method === 'GET') {
            const month = url.searchParams.get('month')
            const data = state.budgets
                .filter(
                    (budget) =>
                        active(budget, includeArchived) && (!month || budget.month === month),
                )
                .map((budget) => ({
                    ...budget,
                    category: (() => {
                        const category = state.categories.find(
                            (item) => item.id === budget.categoryId,
                        )
                        const section = category
                            ? state.sections.find((item) => item.id === category.sectionId)
                            : null
                        return category
                            ? { ...category, section: section ?? { color: '#000000' } }
                            : {
                                  id: budget.categoryId,
                                  name: 'Category',
                                  icon: 'tag',
                                  sectionId: '',
                                  section: { color: '#000000' },
                              }
                    })(),
                    spent: state.transactions
                        .filter(
                            (transaction) =>
                                !transaction.isArchived &&
                                transaction.type === 'EXPENSE' &&
                                transaction.categoryId === budget.categoryId &&
                                transaction.date.startsWith(budget.month),
                        )
                        .reduce((total, transaction) => total + transaction.amount, 0),
                    remaining:
                        Number(budget.amount) -
                        state.transactions
                            .filter(
                                (transaction) =>
                                    !transaction.isArchived &&
                                    transaction.type === 'EXPENSE' &&
                                    transaction.categoryId === budget.categoryId &&
                                    transaction.date.startsWith(budget.month),
                            )
                            .reduce((total, transaction) => total + transaction.amount, 0),
                    progress: Math.min(
                        100,
                        (state.transactions
                            .filter(
                                (transaction) =>
                                    !transaction.isArchived &&
                                    transaction.type === 'EXPENSE' &&
                                    transaction.categoryId === budget.categoryId &&
                                    transaction.date.startsWith(budget.month),
                            )
                            .reduce((total, transaction) => total + transaction.amount, 0) /
                            Number(budget.amount)) *
                            100,
                    ),
                    isOverBudget: false,
                    transactionCount: 0,
                }))
            send(response, 200, { data })
            return true
        }
        if (request.method === 'POST') {
            const budget = {
                id: `budget-${state.budgets.length + 1}`,
                ...body,
                amount: Number(body.amount),
                isArchived: false,
                createdAt: now(),
                updatedAt: now(),
            }
            state.budgets.push(budget)
            send(response, 201, { data: budget })
            return true
        }
        const budget = state.budgets.find((item) => item.id === id)
        if (!budget) {
            send(response, 404, { error: { code: 'NOT_FOUND', message: 'Budget not found' } })
            return true
        }
        if (request.method === 'PATCH') Object.assign(budget, body, { updatedAt: now() })
        if (request.method === 'DELETE') budget.isArchived = true
        send(response, 200, { data: budget })
        return true
    }

    if (resource === 'summary' && id === 'monthly') {
        const month = url.searchParams.get('month') ?? '2026-06'
        const transactions = state.transactions.filter(
            (transaction) => !transaction.isArchived && transaction.date.startsWith(month),
        )
        const incomeTotal = transactions
            .filter((transaction) => transaction.type === 'INCOME')
            .reduce((total, transaction) => total + transaction.amount, 0)
        const expenseTotal = transactions
            .filter((transaction) => transaction.type === 'EXPENSE')
            .reduce((total, transaction) => total + transaction.amount, 0)
        send(response, 200, {
            data: {
                month,
                period: { startDate: `${month}-01`, endDate: `${month}-30` },
                totals: {
                    incomeTotal,
                    expenseTotal,
                    adjustmentTotal: 0,
                    transferTotal: 0,
                    netTotal: incomeTotal - expenseTotal,
                    transactionCount: transactions.length,
                },
                topExpenseCategories: [],
                topIncomeCategories: [],
                accountBreakdown: [],
                recentTransactions: transactions.slice(0, 5),
            },
        })
        return true
    }

    return false
}

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

    if (url.pathname.startsWith('/api/v1/')) {
        if (await handleDomainRequest(request, response, url)) return
    }

    send(response, 404, { error: { code: 'NOT_FOUND', message: 'Not found' } })
})

server.listen(port, '127.0.0.1')
