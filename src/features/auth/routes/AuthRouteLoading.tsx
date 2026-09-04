import { LoadingSpinner } from '@/components/feedback'

export const AuthRouteLoading = () => {
    return (
        <div className="flex min-h-dvh items-center justify-center">
            <LoadingSpinner size="lg" aria-label="Checking authentication" />
        </div>
    )
}
