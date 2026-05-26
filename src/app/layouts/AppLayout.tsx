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
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:left-4 focus:top-4 focus:rounded focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-ring"
            >
                Skip to main content
            </a>
            <AppNav onLogout={handleLogout} isLoggingOut={isPending} />
            <main id="main-content" className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    )
}
