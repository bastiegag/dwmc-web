import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'

export const AnonymousRoute = () => {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner size="lg" aria-label="Checking authentication" />
            </div>
        )
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />
    }

    return <Outlet />
}
