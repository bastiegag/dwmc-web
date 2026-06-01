import type { CategoryFormValues } from '@/features/categories/schemas'
import type { SectionWithCategories } from '@/features/categories/types'
import { Button } from '@/components/ui/button'
import { CategoryForm } from './CategoryForm'

type CategoryDialogProps = {
    open: boolean
    mode: 'create' | 'edit'
    sections: SectionWithCategories[]
    initialValues?: CategoryFormValues
    isPending?: boolean
    errorMessage?: string | null
    onOpenChange: (open: boolean) => void
    onSubmit: (values: CategoryFormValues) => Promise<void> | void
}

export function CategoryDialog({
    open,
    mode,
    sections,
    initialValues,
    isPending,
    errorMessage,
    onOpenChange,
    onSubmit,
}: CategoryDialogProps) {
    if (!open) return null

    const title = mode === 'create' ? 'Create category' : 'Edit category'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="category-dialog-title"
                className="w-full max-w-md rounded-lg border bg-background p-4 shadow-lg"
            >
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 id="category-dialog-title" className="text-lg font-semibold">
                        {title}
                    </h2>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        aria-label="Close category dialog"
                    >
                        Close
                    </Button>
                </div>

                <CategoryForm
                    sections={sections}
                    initialValues={initialValues}
                    submitLabel={mode === 'create' ? 'Create category' : 'Save changes'}
                    isPending={isPending}
                    errorMessage={errorMessage}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    )
}
