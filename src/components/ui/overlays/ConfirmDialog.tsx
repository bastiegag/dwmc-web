import { useRef, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/actions/Button'
import { getErrorMessage } from '@/shared/errors'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './AlertDialog'

export type ConfirmDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: ReactNode
    description: ReactNode
    confirmLabel?: string
    cancelLabel?: string
    pendingLabel?: string
    errorFallback?: string
    variant?: 'default' | 'destructive'
    onConfirm: () => Promise<void> | void
}

type ConfirmDialogContentProps = Omit<ConfirmDialogProps, 'open' | 'onOpenChange'> & {
    onClose: () => void
    pendingRef: { current: boolean }
}

const ConfirmDialogContent = ({
    onClose,
    pendingRef,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    pendingLabel = 'Working...',
    errorFallback = 'Unable to complete this action. Please try again.',
    variant = 'default',
    onConfirm,
}: ConfirmDialogContentProps) => {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleConfirm = async () => {
        if (pendingRef.current) return

        pendingRef.current = true
        setIsPending(true)
        setError(null)

        try {
            await onConfirm()
        } catch (confirmationError) {
            setError(getErrorMessage(confirmationError, errorFallback))
            return
        } finally {
            pendingRef.current = false
            setIsPending(false)
        }

        onClose()
    }

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            {error ? (
                <p role="alert" className="text-sm text-destructive-border">
                    {error}
                </p>
            ) : null}
            <AlertDialogFooter>
                <AlertDialogCancel
                    disabled={isPending}
                    render={<Button type="button" variant="outlined" disabled={isPending} />}
                >
                    {cancelLabel}
                </AlertDialogCancel>
                <Button
                    type="button"
                    color={variant === 'destructive' ? 'destructive' : 'default'}
                    disabled={isPending}
                    isLoading={isPending}
                    loadingText={pendingLabel}
                    onClick={handleConfirm}
                >
                    {confirmLabel}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}

export const ConfirmDialog = ({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    pendingLabel = 'Working...',
    errorFallback = 'Unable to complete this action. Please try again.',
    variant = 'default',
    onConfirm,
}: ConfirmDialogProps) => {
    const pendingRef = useRef(false)

    return (
        <AlertDialog
            open={open}
            onOpenChange={(nextOpen, eventDetails) => {
                if (!nextOpen && pendingRef.current) {
                    eventDetails.cancel()
                    return
                }

                onOpenChange(nextOpen)
            }}
        >
            {open ? (
                <ConfirmDialogContent
                    onClose={() => onOpenChange(false)}
                    pendingRef={pendingRef}
                    title={title}
                    description={description}
                    confirmLabel={confirmLabel}
                    cancelLabel={cancelLabel}
                    pendingLabel={pendingLabel}
                    errorFallback={errorFallback}
                    variant={variant}
                    onConfirm={onConfirm}
                />
            ) : null}
        </AlertDialog>
    )
}
