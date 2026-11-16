import { useMemo } from 'react'
import type { BudgetFormValues } from '@/features/budgets/schemas/budget.schema'
import type { BudgetFormInput } from '@/features/budgets/schemas/budget.schema'
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui'
import { BudgetForm } from './BudgetForm'
import type { SectionWithCategories } from '@/features/categories'

type Props = {
    open: boolean
    mode: 'create' | 'edit'
    sections: SectionWithCategories[]
    initialValues?: BudgetFormInput
    defaultMonth?: string
    isPending?: boolean
    isCategoriesLoading?: boolean
    errorMessage?: string | null
    onOpenChange: (open: boolean) => void
    onSubmit: (values: BudgetFormValues) => Promise<void> | void
}

export const BudgetDialog = ({
    open,
    mode,
    sections,
    initialValues,
    defaultMonth,
    isPending = false,
    isCategoriesLoading,
    errorMessage,
    onOpenChange,
    onSubmit,
}: Props) => {
    const title = mode === 'create' ? 'New Budget' : 'Edit budget'

    const values = useMemo(
        () =>
            initialValues ??
            (defaultMonth ? { categoryId: '', month: defaultMonth, amount: '0' } : undefined),
        [defaultMonth, initialValues],
    )

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen && isPending) return
        onOpenChange(nextOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader className="mb-4 flex-row items-center justify-between gap-3">
                    <DialogTitle>{title}</DialogTitle>
                    <Button
                        type="button"
                        variant="link"
                        className="no-underline hover:bg-accent/10"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleOpenChange(false)}
                        aria-label="Close budget dialog"
                    >
                        Close
                    </Button>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Enter the budget details and submit the form.
                </DialogDescription>

                <BudgetForm
                    sections={sections}
                    initialValues={values}
                    submitLabel={mode === 'create' ? 'Create budget' : 'Save changes'}
                    isPending={isPending}
                    isCategoriesLoading={isCategoriesLoading}
                    errorMessage={errorMessage}
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    )
}

export default BudgetDialog
