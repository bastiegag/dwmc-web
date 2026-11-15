import { Alert } from '@/components/ui'
import { cn } from '@/lib/utils'
import { LoadingSpinner } from './LoadingSpinner'

export interface QueryStateProps {
    isLoading: boolean
    isError: boolean
    loadingLabel: string
    errorTitle: string
    errorMessage?: string | null
    fallbackErrorMessage: string
    onRetry?: () => void
    retryLabel?: string
    className?: string
}

export const QueryState = ({
    isLoading,
    isError,
    loadingLabel,
    errorTitle,
    errorMessage,
    fallbackErrorMessage,
    onRetry,
    retryLabel = 'Retry',
    className,
}: QueryStateProps) => {
    if (isLoading) {
        return (
            <div className={cn('flex min-h-32 items-center justify-center gap-3 py-6', className)}>
                <LoadingSpinner aria-hidden="true" />

                <span role="status" className="text-sm text-muted-foreground">
                    {loadingLabel}
                </span>
            </div>
        )
    }

    if (!isError) return null

    return (
        <Alert
            variant="destructive"
            title={errorTitle}
            description={errorMessage?.trim() || fallbackErrorMessage}
            action={
                onRetry
                    ? {
                          label: retryLabel,
                          onClick: onRetry,
                      }
                    : undefined
            }
            className={className}
        />
    )
}
