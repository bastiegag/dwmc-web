import type { CategoryFormSubmitValues, CategoryFormValues } from '@/features/categories/schemas'
import type { SectionWithCategories } from '@/features/categories/types'
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui'
import { CategoryForm } from './CategoryForm'

type CategoryDialogProps = {
    open: boolean
    mode: 'create' | 'edit'
    sections: SectionWithCategories[]
    initialValues?: CategoryFormValues
    isPending?: boolean
    errorMessage?: string | null
    onOpenChange: (open: boolean) => void
    onSubmit: (values: CategoryFormSubmitValues) => Promise<void> | void
}

export const CategoryDialog = ({
    open,
    mode,
    sections,
    initialValues,
    isPending,
    errorMessage,
    onOpenChange,
    onSubmit,
}: CategoryDialogProps) => {
    const title = mode === 'create' ? 'Create category' : 'Edit category'
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
                        aria-label="Close category dialog"
                    >
                        Close
                    </Button>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Enter the category details and submit the form.
                </DialogDescription>

                <CategoryForm
                    sections={sections}
                    initialValues={initialValues}
                    submitLabel={mode === 'create' ? 'Create category' : 'Save changes'}
                    isPending={isPending}
                    errorMessage={errorMessage}
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    )
}
