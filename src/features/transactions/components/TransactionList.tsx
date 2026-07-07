import type { Transaction } from '@/features/transactions/types/transaction.types'
import { TransactionItem } from './TransactionItem'

type TransactionListProps = {
    transactions: Transaction[]
    onEdit: (t: Transaction) => void
    onArchive: (t: Transaction) => void
}

export const TransactionList = ({ transactions, onEdit, onArchive }: TransactionListProps) => {
    return (
        <div>
            {transactions.map((t) => (
                <TransactionItem key={t.id} transaction={t} onEdit={onEdit} onArchive={onArchive} />
            ))}
        </div>
    )
}

export default TransactionList
