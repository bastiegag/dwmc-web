import type { AccountFormValues } from '@/features/accounts/schemas/account.schema'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
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
    const title = mode === 'create' ? 'Create account' : 'Edit account'

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
                        aria-label="Close account dialog"
                    >
                        Close
                    </Button>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Enter the account details and submit the form.
                </DialogDescription>

                <AccountForm
                    initialValues={initialValues}
                    submitLabel={mode === 'create' ? 'Create account' : 'Save changes'}
                    isPending={isPending}
                    errorMessage={errorMessage}
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    )
}

export default AccountDialog
