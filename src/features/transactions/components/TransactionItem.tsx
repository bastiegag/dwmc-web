import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Transaction } from '@/features/transactions/types/transaction.types'

const currencyFormatter = new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' })

type TransactionItemProps = {
    transaction: Transaction
    onEdit: (t: Transaction) => void
    onArchive: (t: Transaction) => void
}

export function TransactionItem({ transaction, onEdit, onArchive }: TransactionItemProps) {
    const { type, amount, date } = transaction

    const displayAmount = currencyFormatter.format(amount)
    const dateLabel = (() => {
        try {
            return new Date(date).toISOString().slice(0, 10)
        } catch {
            return date
        }
    })()

    return (
        <Card className="mb-3 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-baseline gap-3">
                        <span className="font-medium">{type}</span>
                        <span className="text-sm text-muted-foreground">{dateLabel}</span>
                    </div>
                    <div className="mt-1 text-lg font-semibold">{displayAmount}</div>
                    <div className="text-sm text-muted-foreground mt-2">
                        {transaction.merchant ?? transaction.note ?? (
                            <span className="text-muted-foreground">No description</span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="text-sm text-muted-foreground">
                        {type === 'TRANSFER'
                            ? `${transaction.fromAccount?.name ?? 'From'} → ${transaction.toAccount?.name ?? 'To'}`
                            : transaction.account?.name}
                    </div>

                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(transaction)}>
                            Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onArchive(transaction)}>
                            Archive
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default TransactionItem
