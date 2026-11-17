import { Alert } from '@/components/ui'
import { getErrorMessage } from '@/shared/errors'

interface QueryState {
    hasData: boolean
    isLoading: boolean
    isFetching: boolean
    error: unknown
    onRetry: () => void
}

interface TransactionOptionsStateProps {
    accounts: QueryState
    categories: QueryState
    showLoading?: boolean
}

export const TransactionOptionsState = ({
    accounts,
    categories,
    showLoading = false,
}: TransactionOptionsStateProps) => {
    const loadingOptions =
        showLoading &&
        ((accounts.isLoading && !accounts.hasData) || (categories.isLoading && !categories.hasData))

    const failedQueries = [
        {
            key: 'accounts',
            label: 'accounts',
            query: accounts,
        },
        {
            key: 'categories',
            label: 'categories',
            query: categories,
        },
    ].filter(({ query }) => query.error)

    if (!loadingOptions && failedQueries.length === 0) return null

    return (
        <div className="space-y-3">
            {loadingOptions ? (
                <p role="status" className="text-sm text-muted-foreground">
                    Loading transaction options...
                </p>
            ) : null}
            {failedQueries.map(({ key, label, query }) => (
                <Alert
                    key={key}
                    variant={query.hasData ? 'warning' : 'destructive'}
                    role={query.hasData ? 'status' : undefined}
                    title={
                        query.hasData
                            ? `${label[0].toUpperCase()}${label.slice(1)} could not be refreshed`
                            : `Could not load ${label}`
                    }
                    description={getErrorMessage(
                        query.error,
                        `Unable to load ${label} for transaction options.`,
                    )}
                    action={{
                        label: `Retry ${label}`,
                        disabled: query.isFetching,
                        onClick: query.onRetry,
                    }}
                    className="mb-0"
                />
            ))}
        </div>
    )
}
