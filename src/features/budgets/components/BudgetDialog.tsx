import type { BudgetFormValues } from '@/features/budgets/schemas/budget.schema'
import { Button } from '@/components/ui'
import {
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
    initialValues?: BudgetFormValues
    defaultMonth?: string
    isPending?: boolean
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
    isPending,
    errorMessage,
    onOpenChange,
    onSubmit,
}: Props) => {
    const title = mode === 'create' ? 'New Budget' : 'Edit budget'

    const values =
        initialValues ??
        (defaultMonth ? { categoryId: '', month: defaultMonth, amount: 0 } : undefined)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader className="mb-4 flex-row items-center justify-between gap-3">
                    <DialogTitle>{title}</DialogTitle>
                    <Button
                        type="button"
                        variant="link"
                        className="no-underline hover:bg-accent/10"
                        size="sm"
                        onClick={() => onOpenChange(false)}
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
                    errorMessage={errorMessage}
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    )
}

export default BudgetDialog
