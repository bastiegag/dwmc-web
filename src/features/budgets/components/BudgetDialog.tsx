import type { BudgetFormValues } from '@/features/budgets/schemas/budget.schema'
import { Button } from '@/components/ui/button'
import { BudgetForm } from './BudgetForm'
import type { SectionWithCategories } from '@/features/categories/types'

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
    if (!open) return null

    const title = mode === 'create' ? 'Create budget' : 'Edit budget'

    const values =
        initialValues ??
        (defaultMonth ? { categoryId: '', month: defaultMonth, amount: 0 } : undefined)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                className="w-full max-w-md rounded-lg border bg-background p-4 shadow-lg"
            >
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        aria-label="Close budget dialog"
                    >
                        Close
                    </Button>
                </div>

                <BudgetForm
                    sections={sections}
                    initialValues={values}
                    submitLabel={mode === 'create' ? 'Create budget' : 'Save changes'}
                    isPending={isPending}
                    errorMessage={errorMessage}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    )
}

export default BudgetDialog
