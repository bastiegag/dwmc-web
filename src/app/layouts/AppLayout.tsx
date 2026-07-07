import { Outlet, useLocation } from 'react-router-dom'
import { useLogout } from '@/features/auth/hooks'
import { PrimaryActionProvider } from '@/shared/primary-action'
import { MonthNavigator } from '@/shared/month'
import {
    AppTopBar,
    AppBottomNavigation,
    DesktopSidebar,
    ContextualFloatingActionButton,
} from '@/components/layout'

const monthNavRoutes = ['/app/dashboard', '/app/transactions', '/app/budgets']

export function AppLayout() {
    const { mutate: logout, isPending: isLoggingOut } = useLogout()
    const location = useLocation()

    const showMonthNav = monthNavRoutes.some((path) => location.pathname.startsWith(path))

    return (
        <>
            <DesktopSidebar />

            <PrimaryActionProvider>
                <div className="flex min-h-screen flex-col bg-background lg:pl-64">
                    <AppTopBar onLogout={logout} isLoggingOut={isLoggingOut} />

                    {showMonthNav && (
                        <div className="flex h-16 items-center justify-center border-b">
                            <MonthNavigator />
                        </div>
                    )}

                    <main
                        id="main-content"
                        className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 pb-[calc(4rem+1.5rem+env(safe-area-inset-bottom))]"
                    >
                        <Outlet />
                    </main>
                </div>

                <AppBottomNavigation />
                <ContextualFloatingActionButton />
            </PrimaryActionProvider>
        </>
    )
}
