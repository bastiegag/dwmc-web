import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'

export default function Loading() {
    return (
        <div className="flex min-h-dvh items-center justify-center">
            <LoadingSpinner size="lg" aria-label="Loading page" />
        </div>
    )
}
