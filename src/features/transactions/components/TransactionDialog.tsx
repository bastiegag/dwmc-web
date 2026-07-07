import { Button } from '@/components/ui/button'
import TransactionForm from './TransactionForm'
import type { TransactionFormValues } from '@/features/transactions/schemas/transaction.schema'
import type { Account } from '@/features/accounts/types/account.types'
import type { SectionWithCategories } from '@/features/categories/types'

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
    if (!open) return null

    const title = mode === 'create' ? 'Create transaction' : 'Edit transaction'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="transaction-dialog-title"
                className="w-full max-w-lg rounded-lg border bg-background p-4 shadow-lg"
            >
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 id="transaction-dialog-title" className="text-lg font-semibold">
                        {title}
                    </h2>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        aria-label="Close transaction dialog"
                    >
                        Close
                    </Button>
                </div>

                <TransactionForm
                    accounts={accounts}
                    sections={sections}
                    initialValues={initialValues ?? undefined}
                    isPending={isPending}
                    errorMessage={errorMessage}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    )
}

export default TransactionDialog
