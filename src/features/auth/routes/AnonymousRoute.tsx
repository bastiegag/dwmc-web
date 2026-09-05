import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks'
import { AuthRouteLoading } from './AuthRouteLoading'

export const AnonymousRoute = () => {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return <AuthRouteLoading />
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />
    }

    return <Outlet />
}
