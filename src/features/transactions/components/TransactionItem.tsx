import { useState } from 'react'
import { Button, Badge, Card, ConfirmDialog } from '@/components/ui'
import type { Transaction } from '@/features/transactions/types/transaction.types'
import { isValidDateOnly } from '@/shared/date'
import { formatCurrency } from '@/lib/format-currency'

type TransactionItemProps = {
    transaction: Transaction
    onEdit: (t: Transaction) => void
    onArchive: (t: Transaction) => Promise<void> | void
}

export const TransactionItem = ({ transaction, onEdit, onArchive }: TransactionItemProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { type, amount, date } = transaction

    const displayAmount = formatCurrency(amount)
    const dateLabel = isValidDateOnly(date.slice(0, 10)) ? date.slice(0, 10) : date
    const isIncomeOrExpense = type === 'INCOME' || type === 'EXPENSE'
    const accountLabel =
        transaction.account?.name ?? (transaction.accountId ? 'Account unavailable' : 'No account')
    const categoryLabel =
        transaction.category?.name ??
        (transaction.categoryId ? 'Category unavailable' : 'No category')

    return (
        <Card>
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <Badge
                            variant={
                                type === 'INCOME'
                                    ? 'success'
                                    : type === 'EXPENSE'
                                      ? 'destructive'
                                      : type === 'TRANSFER'
                                        ? 'info'
                                        : 'warning'
                            }
                        >
                            {type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            <span className="sr-only">Date: </span>
                            {dateLabel}
                        </span>
                    </div>
                    <p className="mt-1 max-w-full break-all text-lg font-semibold tabular-nums">
                        {displayAmount}
                    </p>
                    <p className="mt-2 break-words text-sm text-muted-foreground">
                        {transaction.merchant ?? transaction.note ?? 'No description'}
                    </p>
                </div>

                <div className="flex min-w-0 flex-col items-start gap-2 sm:items-end">
                    <div className="break-words text-sm text-muted-foreground sm:text-right">
                        {type === 'TRANSFER'
                            ? `${transaction.fromAccount?.name ?? 'From'} → ${transaction.toAccount?.name ?? 'To'}`
                            : accountLabel}
                    </div>
                    {isIncomeOrExpense && (
                        <div className="break-words text-sm text-muted-foreground sm:text-right">
                            <span className="sr-only">Category: </span>
                            {categoryLabel}
                        </div>
                    )}
                    <div className="flex min-h-11 w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
                        <Button
                            variant="link"
                            className="min-h-11 no-underline hover:bg-accent/10"
                            size="sm"
                            onClick={() => onEdit(transaction)}
                            aria-label={`Edit transaction ${transaction.id}`}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outlined"
                            size="sm"
                            className="min-h-11"
                            onClick={() => {
                                setIsConfirmOpen(true)
                            }}
                            aria-label={`Archive transaction ${transaction.id}`}
                        >
                            Archive
                        </Button>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Archive transaction?"
                description="This will archive this transaction."
                confirmLabel="Archive"
                pendingLabel="Archiving..."
                errorFallback="Unable to archive transaction. Please try again."
                variant="destructive"
                onConfirm={() => onArchive(transaction)}
            />
        </Card>
    )
}

export default TransactionItem
