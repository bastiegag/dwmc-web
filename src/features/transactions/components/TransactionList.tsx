import type { Transaction } from '@/features/transactions/types/transaction.types'
import { TransactionItem } from './TransactionItem'

type TransactionListProps = {
    transactions: Transaction[]
    onEdit: (t: Transaction) => void
    onArchive: (t: Transaction) => Promise<void> | void
}

export const TransactionList = ({ transactions, onEdit, onArchive }: TransactionListProps) => {
    return (
        <ul aria-label="Transactions" className="space-y-3">
            {transactions.map((t) => (
                <li key={t.id}>
                    <TransactionItem transaction={t} onEdit={onEdit} onArchive={onArchive} />
                </li>
            ))}
        </ul>
    )
}

export default TransactionList
