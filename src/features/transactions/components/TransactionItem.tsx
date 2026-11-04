import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Transaction } from '@/features/transactions/types/transaction.types'
import { isValidDateOnly } from '@/shared/date'
import { getErrorMessage } from '@/shared/errors'

const currencyFormatter = new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' })

type TransactionItemProps = {
    transaction: Transaction
    onEdit: (t: Transaction) => void
    onArchive: (t: Transaction) => void
}

export const TransactionItem = ({ transaction, onEdit, onArchive }: TransactionItemProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [archiveError, setArchiveError] = useState<string | null>(null)
    const [isArchiving, setIsArchiving] = useState(false)
    const { type, amount, date } = transaction

    const displayAmount = currencyFormatter.format(amount)
    const dateLabel = isValidDateOnly(date.slice(0, 10)) ? date.slice(0, 10) : date

    return (
        <Card className="mb-3">
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
                        <Button
                            variant="link"
                            className="no-underline hover:bg-accent/10"
                            size="sm"
                            onClick={() => onEdit(transaction)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outlined"
                            size="sm"
                            onClick={() => {
                                setArchiveError(null)
                                setIsConfirmOpen(true)
                            }}
                            aria-label={`Archive transaction ${transaction.id}`}
                        >
                            Archive
                        </Button>
                    </div>
                </div>
            </div>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Archive transaction?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will archive this transaction.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {archiveError ? (
                        <p role="alert" className="text-sm text-destructive">
                            {archiveError}
                        </p>
                    ) : null}
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            asChild
                            disabled={isArchiving}
                            onClick={async (event) => {
                                event.preventDefault()
                                setIsArchiving(true)
                                setArchiveError(null)
                                try {
                                    await onArchive(transaction)
                                    setIsConfirmOpen(false)
                                } catch (error) {
                                    setArchiveError(
                                        getErrorMessage(
                                            error,
                                            'Unable to archive transaction. Please try again.',
                                        ),
                                    )
                                } finally {
                                    setIsArchiving(false)
                                }
                            }}
                        >
                            <Button type="button" color="destructive" variant="contained">
                                {isArchiving ? 'Archiving...' : 'Archive'}
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}

export default TransactionItem
