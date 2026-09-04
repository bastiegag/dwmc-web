import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
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
        <Alert variant="destructive">
            <AlertTitle>{errorTitle}</AlertTitle>
            <AlertDescription>
                {errorMessage ?? fallbackErrorMessage}
                {onRetry ? (
                    <div className="mt-2">
                        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                            Retry
                        </Button>
                    </div>
                ) : null}
            </AlertDescription>
        </Alert>
    )
}
