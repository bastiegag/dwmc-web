import type { Account } from '@/features/accounts/types/account.types'
import type { Budget } from '@/features/budgets/types/budget.types'
import type { Category } from '@/features/categories/types/category.types'
import type { Section, SectionWithCategories } from '@/features/categories/types/section.types'
import type { Transaction } from '@/features/transactions/types/transaction.types'

const fixtureTimestamp = '2024-01-01T00:00:00.000Z'

export const createAccount = (overrides: Partial<Account> = {}): Account => ({
    id: 'a1',
    name: 'Checking',
    type: 'CHECKING',
    startingBalance: 1250.75,
    currentBalance: 1250.75,
    goal: null,
    color: '#3b82f6',
    icon: 'wallet',
    isArchived: false,
    createdAt: fixtureTimestamp,
    updatedAt: fixtureTimestamp,
    ...overrides,
})

export const createCategory = (overrides: Partial<Category> = {}): Category => ({
    id: 'cat-1',
    name: 'Groceries',
    icon: 'shopping-cart',
    sectionId: 'section-1',
    isArchived: false,
    createdAt: fixtureTimestamp,
    updatedAt: fixtureTimestamp,
    ...overrides,
})

export const createSection = (overrides: Partial<Section> = {}): Section => ({
    id: 'section-1',
    name: 'Food',
    color: '#22c55e',
    isArchived: false,
    createdAt: fixtureTimestamp,
    updatedAt: fixtureTimestamp,
    ...overrides,
})

export const createSectionWithCategories = (
    categories: Category[] = [createCategory()],
    overrides: Partial<Section> = {},
): SectionWithCategories => ({
    ...createSection(overrides),
    categories,
})

export const createBudget = (overrides: Partial<Budget> = {}): Budget => ({
    id: 'budget-1',
    month: '2026-06',
    amount: 500,
    spent: 600,
    remaining: -100,
    progress: 120,
    isOverBudget: true,
    transactionCount: 4,
    isArchived: false,
    createdAt: fixtureTimestamp,
    updatedAt: fixtureTimestamp,
    category: {
        id: 'cat-1',
        name: 'Groceries',
        icon: 'cart',
        sectionId: 'section-1',
        section: {
            id: 'section-1',
            name: 'Food',
            color: '#3b82f6',
        },
    },
    ...overrides,
})

export const createTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
    id: 'tx-1',
    type: 'EXPENSE',
    amount: 48.5,
    date: fixtureTimestamp,
    merchant: 'Local Market',
    note: 'Groceries for the week',
    accountId: 'a1',
    fromAccountId: null,
    toAccountId: null,
    categoryId: 'cat-1',
    isArchived: false,
    createdAt: fixtureTimestamp,
    updatedAt: fixtureTimestamp,
    account: {
        id: 'a1',
        name: 'Checking',
        color: '#3b82f6',
        icon: 'wallet',
    },
    category: {
        id: 'cat-1',
        name: 'Groceries',
        icon: 'shopping-cart',
        sectionId: 'section-1',
    },
    ...overrides,
})
