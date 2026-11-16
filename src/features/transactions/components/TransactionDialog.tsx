import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui'
import TransactionForm from './TransactionForm'
import type { TransactionFormValues } from '@/features/transactions/schemas/transaction.schema'
import type { Account } from '@/features/accounts'
import type { SectionWithCategories } from '@/features/categories'

type TransactionDialogProps = {
    open: boolean
    mode: 'create' | 'edit'
    accounts: Account[]
    sections: SectionWithCategories[]
    initialValues?: TransactionFormValues | null
    isPending?: boolean
    errorMessage?: string | null
    onOpenChange: (open: boolean) => void
    onSubmit: (values: TransactionFormValues) => Promise<void> | void
}

export const TransactionDialog = ({
    open,
    mode,
    accounts,
    sections,
    initialValues,
    isPending = false,
    errorMessage,
    onOpenChange,
    onSubmit,
}: TransactionDialogProps) => {
    const title = mode === 'create' ? 'New Transaction' : 'Edit transaction'
    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen && isPending) return
        onOpenChange(nextOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-lg overflow-y-auto overscroll-contain">
                <DialogHeader className="mb-4 flex-row items-center justify-between gap-3">
                    <div>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription className="sr-only">
                            Enter the transaction details and submit the form.
                        </DialogDescription>
                    </div>
                    <Button
                        type="button"
                        variant="link"
                        className="no-underline hover:bg-accent/10"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleOpenChange(false)}
                        aria-label="Close transaction dialog"
                    >
                        Close
                    </Button>
                </DialogHeader>

                <TransactionForm
                    accounts={accounts}
                    sections={sections}
                    initialValues={initialValues ?? undefined}
                    isPending={isPending}
                    errorMessage={errorMessage}
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    )
}

export default TransactionDialog
