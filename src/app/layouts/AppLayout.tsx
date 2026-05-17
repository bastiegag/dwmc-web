import { Outlet, useNavigate } from 'react-router-dom'
import { AppNav } from '@/components/layout/AppNav'
import { useLogout } from '@/features/auth/hooks/useLogout'

export function AppLayout() {
    const navigate = useNavigate()
    const { logout, isPending } = useLogout()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <AppNav onLogout={handleLogout} isLoggingOut={isPending} />
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    )
}
