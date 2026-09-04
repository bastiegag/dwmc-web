import { lazy, Suspense, type ComponentType } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { NotFoundPage } from '@/app/pages/NotFoundPage'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { AppLayout } from '@/app/layouts/AppLayout'
import { ProtectedRoute } from '@/features/auth/routes/ProtectedRoute'
import { AnonymousRoute } from '@/features/auth/routes/AnonymousRoute'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'

const lazyNamed = <
    TModule extends Record<string, ComponentType>,
    TExportName extends keyof TModule,
>(
    loader: () => Promise<TModule>,
    exportName: TExportName,
) =>
    lazy(async () => {
        const loadedModule = await loader()
        const component = loadedModule[exportName]

        if (component === undefined) {
            throw new Error(`Lazy-loaded module is missing export "${String(exportName)}"`)
        }

        return { default: component }
    })

const LoginPage = lazyNamed(() => import('@/features/auth/pages/LoginPage'), 'LoginPage')
const SignupPage = lazyNamed(() => import('@/features/auth/pages/SignupPage'), 'SignupPage')
const ForgotPasswordPage = lazyNamed(
    () => import('@/features/auth/pages/ForgotPasswordPage'),
    'ForgotPasswordPage',
)
const ResetPasswordPage = lazyNamed(
    () => import('@/features/auth/pages/ResetPasswordPage'),
    'ResetPasswordPage',
)
const DashboardPage = lazyNamed(
    () => import('@/features/dashboard/pages/DashboardPage'),
    'DashboardPage',
)
const CategoriesPage = lazyNamed(
    () => import('@/features/categories/pages/CategoriesPage'),
    'CategoriesPage',
)
const AccountsPage = lazyNamed(
    () => import('@/features/accounts/pages/AccountsPage'),
    'AccountsPage',
)
const TransactionsPage = lazyNamed(
    () => import('@/features/transactions/pages/TransactionsPage'),
    'TransactionsPage',
)
const BudgetsPage = lazyNamed(() => import('@/features/budgets/pages/BudgetsPage'), 'BudgetsPage')
const ToolsPage = lazyNamed(() => import('@/app/pages/ToolsPage'), 'ToolsPage')
const ProfilePage = lazyNamed(() => import('@/features/profile/pages/ProfilePage'), 'ProfilePage')
const SettingsPage = lazyNamed(() => import('@/features/settings'), 'SettingsPage')
const PageLoader = () => {
    return (
        <div className="flex min-h-dvh items-center justify-center">
            <LoadingSpinner size="lg" aria-label="Loading page" />
        </div>
    )
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    { index: true, element: <Navigate to="/dashboard" replace /> },
                    {
                        path: 'dashboard',
                        element: <DashboardPage />,
                    },
                    {
                        path: 'transactions',
                        element: <TransactionsPage />,
                    },
                    {
                        path: 'budgets',
                        element: <BudgetsPage />,
                    },
                    {
                        path: 'accounts',
                        element: <AccountsPage />,
                    },
                    {
                        path: 'tools',
                        element: <Outlet />,
                        children: [
                            { index: true, element: <ToolsPage /> },
                            { path: 'profile', element: <ProfilePage /> },
                            { path: 'settings', element: <SettingsPage /> },
                            { path: 'categories', element: <Navigate to="/categories" replace /> },
                        ],
                    },
                    {
                        path: 'categories',
                        element: <CategoriesPage />,
                    },
                ],
            },
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            {
                element: <AnonymousRoute />,
                children: [
                    { index: true, element: <Navigate to="/login" replace /> },
                    { path: 'login', element: <LoginPage /> },
                    { path: 'signup', element: <SignupPage /> },
                    { path: 'forgot-password', element: <ForgotPasswordPage /> },
                ],
            },
            { path: 'reset-password', element: <ResetPasswordPage /> },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
])

export const AppRouter = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <ErrorBoundary>
                <RouterProvider router={router} />
            </ErrorBoundary>
        </Suspense>
    )
}
