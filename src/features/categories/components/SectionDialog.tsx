import type { SectionFormValues } from '@/features/categories/schemas'
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui'
import { SectionForm } from './SectionForm'

type SectionDialogProps = {
    open: boolean
    mode: 'create' | 'edit'
    initialValues?: SectionFormValues
    isPending?: boolean
    errorMessage?: string | null
    onOpenChange: (open: boolean) => void
    onSubmit: (values: SectionFormValues) => Promise<void> | void
}

export const SectionDialog = ({
    open,
    mode,
    initialValues,
    isPending,
    errorMessage,
    onOpenChange,
    onSubmit,
}: SectionDialogProps) => {
    const title = mode === 'create' ? 'Create section' : 'Edit section'

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
                        aria-label="Close section dialog"
                    >
                        Close
                    </Button>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Enter the section details and submit the form.
                </DialogDescription>

                <SectionForm
                    initialValues={initialValues}
                    submitLabel={mode === 'create' ? 'Create section' : 'Save changes'}
                    isPending={isPending}
                    errorMessage={errorMessage}
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    )
}
