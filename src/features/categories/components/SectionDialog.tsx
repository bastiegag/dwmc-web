import type { SectionFormValues } from '@/features/categories/schemas'
import { Button } from '@/components/ui/button'
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
    if (!open) return null

    const title = mode === 'create' ? 'Create section' : 'Edit section'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="section-dialog-title"
                className="w-full max-w-md rounded-lg border bg-background p-4 shadow-lg"
            >
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 id="section-dialog-title" className="text-lg font-semibold">
                        {title}
                    </h2>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        aria-label="Close section dialog"
                    >
                        Close
                    </Button>
                </div>

                <SectionForm
                    initialValues={initialValues}
                    submitLabel={mode === 'create' ? 'Create section' : 'Save changes'}
                    isPending={isPending}
                    errorMessage={errorMessage}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    )
}
