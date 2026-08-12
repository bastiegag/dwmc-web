import { setupServer } from 'msw/node'
import { authHandlers } from './handlers/auth'
import { accountHandlers } from './handlers/accounts'
import { transactionHandlers } from './handlers/transactions'
import { dashboardHandlers } from './handlers/dashboard'
import { budgetHandlers } from './handlers/budgets'
import { profileHandlers } from './handlers/profile'

export const server = setupServer(
    ...authHandlers,
    ...accountHandlers,
    ...transactionHandlers,
    ...dashboardHandlers,
    ...budgetHandlers,
    ...profileHandlers,
)
