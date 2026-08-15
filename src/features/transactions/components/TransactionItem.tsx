import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDialogFocus } from '@/components/dialog/use-dialog-focus'
import type { Transaction } from '@/features/transactions/types/transaction.types'

const currencyFormatter = new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' })

type TransactionItemProps = {
    transaction: Transaction
    onEdit: (t: Transaction) => void
    onArchive: (t: Transaction) => void
}

export const TransactionItem = ({ transaction, onEdit, onArchive }: TransactionItemProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { dialogRef, handleKeyDown } = useDialogFocus({
        open: isConfirmOpen,
        onClose: () => setIsConfirmOpen(false),
    })
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
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsConfirmOpen(true)}
                            aria-label={`Archive transaction ${transaction.id}`}
                        >
                            Archive
                        </Button>
                    </div>
                </div>
            </div>

            {isConfirmOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <dialog
                        ref={dialogRef}
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby={`archive-transaction-${transaction.id}`}
                        tabIndex={-1}
                        onKeyDown={handleKeyDown}
                        className="w-full max-w-sm rounded-lg border bg-background p-4 shadow-lg"
                        open
                    >
                        <h3
                            id={`archive-transaction-${transaction.id}`}
                            className="text-base font-semibold"
                        >
                            Archive transaction?
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            This will archive this transaction.
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsConfirmOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={async () => {
                                    await onArchive(transaction)
                                    setIsConfirmOpen(false)
                                }}
                            >
                                Archive
                            </Button>
                        </div>
                    </dialog>
                </div>
            ) : null}
        </Card>
    )
}

export default TransactionItem
