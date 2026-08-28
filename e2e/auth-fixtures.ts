import type { Page } from '@playwright/test'
import type { MonthlySummary } from '../src/features/dashboard/types/summary.types'

export const MOCK_ACCESS_TOKEN =
    'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJtb2NrLXVzZXItaWQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyMDAwMDAwMDAwfQ.'

export const MOCK_SESSION = {
    access_token: MOCK_ACCESS_TOKEN,
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: 'mock-refresh-token',
    user: {
        id: 'mock-user-id',
        email: 'test@example.com',
        aud: 'authenticated',
        created_at: '2026-01-01T00:00:00.000Z',
    },
}

const MOCK_SUMMARY: MonthlySummary = {
    month: '2026-01',
    period: {
        startDate: '2026-01-01T00:00:00.000Z',
        endDate: '2026-02-01T00:00:00.000Z',
    },
    totals: {
        incomeTotal: 1000,
        expenseTotal: 250,
        adjustmentTotal: 0,
        transferTotal: 0,
        netTotal: 750,
        transactionCount: 1,
    },
    topExpenseCategories: [],
    topIncomeCategories: [],
    accountBreakdown: [],
    recentTransactions: [],
}

export const mockAuthenticatedSession = async (page: Page, summary = MOCK_SUMMARY) => {
    await page.route('**/auth/v1/token*', (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(MOCK_SESSION),
        }),
    )
    await page.route('**/auth/v1/user*', (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(MOCK_SESSION.user),
        }),
    )
    await page.route(/\/api\/v1\/summary\/monthly(?:\?.*)?$/, (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: summary }),
        }),
    )
    await page.route(/\/api\/v1\/accounts(?:\?.*)?$/, (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: [] }),
        }),
    )
    await page.route(/\/api\/v1\/sections(?:\?.*)?$/, (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: [], nextCursor: null }),
        }),
    )
    await page.route(/\/api\/v1\/budgets(?:\?.*)?$/, (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: [] }),
        }),
    )
    await page.route(/\/api\/v1\/transactions(?:\?.*)?$/, (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                data: [],
                meta: { page: 1, pageSize: 25, total: 0, totalPages: 0 },
            }),
        }),
    )
    await page.route('**/auth/v1/logout*', (route) => route.fulfill({ status: 204, body: '' }))
}

export const mockPasswordRecoverySession = async (page: Page) => {
    await page.route('**/auth/v1/token*', (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(MOCK_SESSION),
        }),
    )
    await page.route('**/auth/v1/user*', (route) =>
        route.request().method() === 'PUT'
            ? route.fulfill({
                  status: 200,
                  contentType: 'application/json',
                  body: JSON.stringify(MOCK_SESSION.user),
              })
            : route.fulfill({
                  status: 200,
                  contentType: 'application/json',
                  body: JSON.stringify(MOCK_SESSION.user),
              }),
    )
}

export const recoveryHash = () =>
    `#access_token=${MOCK_ACCESS_TOKEN}&refresh_token=mock-refresh-token&expires_in=3600&expires_at=${Math.floor(Date.now() / 1000) + 3600}&token_type=bearer&type=recovery`
