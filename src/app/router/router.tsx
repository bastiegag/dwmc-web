import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { NotFoundPage } from '@/app/pages/NotFoundPage'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { AppLayout } from '@/app/layouts/AppLayout'
import { ProtectedRoute } from '@/features/auth/routes/ProtectedRoute'
import { AnonymousRoute } from '@/features/auth/routes/AnonymousRoute'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'

const LoginPage = lazy(() =>
    import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const SignupPage = lazy(() =>
    import('@/features/auth/pages/SignupPage').then((m) => ({ default: m.SignupPage })),
)
const ForgotPasswordPage = lazy(() =>
    import('@/features/auth/pages/ForgotPasswordPage').then((m) => ({
        default: m.ForgotPasswordPage,
    })),
)
const ResetPasswordPage = lazy(() =>
    import('@/features/auth/pages/ResetPasswordPage').then((m) => ({
        default: m.ResetPasswordPage,
    })),
)
const DashboardPage = lazy(() =>
    import('@/features/dashboard/pages/DashboardPage').then((m) => ({
        default: m.DashboardPage,
    })),
)
const CategoriesPage = lazy(() =>
    import('@/features/categories/pages/CategoriesPage').then((m) => ({
        default: m.CategoriesPage,
    })),
)
const AccountsPage = lazy(() =>
    import('@/features/accounts/pages/AccountsPage').then((m) => ({ default: m.AccountsPage })),
)
const TransactionsPage = lazy(() =>
    import('@/features/transactions/pages/TransactionsPage').then((m) => ({
        default: m.TransactionsPage,
    })),
)
const BudgetsPage = lazy(() =>
    import('@/features/budgets/pages/BudgetsPage').then((m) => ({ default: m.BudgetsPage })),
)
const ToolsPage = lazy(() =>
    import('@/app/pages/ToolsPage').then((m) => ({ default: m.ToolsPage })),
)
const StyleGuidePage = lazy(() =>
    import('@/features/style-guide').then((m) => ({ default: m.StyleGuidePage })),
)

const PageLoader = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
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
                            { path: 'categories', element: <Navigate to="/categories" replace /> },
                        ],
                    },
                    {
                        path: 'categories',
                        element: <CategoriesPage />,
                    },
                    {
                        path: 'style-guide',
                        element: <StyleGuidePage />,
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
