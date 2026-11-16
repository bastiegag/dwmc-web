import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { TransactionList } from '@/features/transactions/components/TransactionList'
import { createTransaction } from '@/test/fixtures/domain'

describe('TransactionList', () => {
    it('exposes transaction rows as a labeled semantic list', () => {
        render(
            <TransactionList
                transactions={[
                    createTransaction({ id: 'transaction-1', merchant: 'First transaction' }),
                    createTransaction({ id: 'transaction-2', merchant: 'Second transaction' }),
                ]}
                onEdit={vi.fn()}
                onArchive={vi.fn()}
            />,
        )

        expect(screen.getByRole('list', { name: 'Transactions' })).toBeInTheDocument()
        expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })
})
