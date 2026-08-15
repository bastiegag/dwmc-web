import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'

export const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner size="lg" aria-label="Checking authentication" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{
                    from: `${location.pathname}${location.search}${location.hash}`,
                }}
                replace
            />
        )
    }

    return <Outlet />
}
