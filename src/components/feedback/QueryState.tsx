import { Alert } from '@/components/ui/alert'
import { LoadingSpinner } from './LoadingSpinner'

interface QueryStateProps {
    isLoading: boolean
    isError: boolean
    loadingLabel: string
    errorTitle: string
    errorMessage?: string
    fallbackErrorMessage: string
    onRetry?: () => void
}

export const QueryState = ({
    isLoading,
    isError,
    loadingLabel,
    errorTitle,
    errorMessage,
    fallbackErrorMessage,
    onRetry,
}: QueryStateProps) => {
    if (isLoading) {
        return (
            <div className="py-6">
                <LoadingSpinner aria-label={loadingLabel} />
            </div>
        )
    }

    if (!isError) return null

    return (
        <Alert
            variant="destructive"
            title={errorTitle}
            description={errorMessage ?? fallbackErrorMessage}
            action={onRetry ? { label: 'Retry', onClick: onRetry } : undefined}
        />
    )
}
