import type { AccountFormValues } from '@/features/accounts/schemas/account.schema'
import { Button } from '@/components/ui/button'
import { useDialogFocus } from '@/shared/dialog'
import { AccountForm } from './AccountForm'

type AccountDialogProps = {
    open: boolean
    mode: 'create' | 'edit'
    initialValues?: AccountFormValues
    isPending?: boolean
    errorMessage?: string | null
    onOpenChange: (open: boolean) => void
    onSubmit: (values: AccountFormValues) => Promise<void> | void
}

export const AccountDialog = ({
    open,
    mode,
    initialValues,
    isPending,
    errorMessage,
    onOpenChange,
    onSubmit,
}: AccountDialogProps) => {
    const { dialogRef, handleKeyDown } = useDialogFocus({
        open,
        onClose: () => onOpenChange(false),
    })

    if (!open) return null

    const title = mode === 'create' ? 'Create account' : 'Edit account'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <dialog
                ref={dialogRef}
                onKeyDown={handleKeyDown}
                tabIndex={-1}
                aria-modal="true"
                aria-labelledby="account-dialog-title"
                className="w-full max-w-md rounded-lg border bg-background p-4 shadow-lg"
                open
            >
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 id="account-dialog-title" className="text-lg font-semibold">
                        {title}
                    </h2>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        aria-label="Close account dialog"
                    >
                        Close
                    </Button>
                </div>

                <AccountForm
                    initialValues={initialValues}
                    submitLabel={mode === 'create' ? 'Create account' : 'Save changes'}
                    isPending={isPending}
                    errorMessage={errorMessage}
                    onSubmit={onSubmit}
                />
            </dialog>
        </div>
    )
}

export default AccountDialog
