import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks'
import { AuthRouteLoading } from './AuthRouteLoading'

export const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return <AuthRouteLoading />
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
