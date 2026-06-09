import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { NotFoundPage } from '@/app/pages/NotFoundPage'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { AppLayout } from '@/app/layouts/AppLayout'
import { ProtectedRoute } from '@/features/auth/routes/ProtectedRoute'
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
    import('@/features/auth/pages/DashboardPage').then((m) => ({
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

function PageLoader() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <LoadingSpinner size="lg" aria-label="Loading page" />
        </div>
    )
}

function RouterContent() {
    const { pathname } = useLocation()
    return (
        <ErrorBoundary key={pathname}>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Auth routes */}
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                    </Route>

                    {/* Protected app routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<AppLayout />}>
                            <Route path="/app" element={<DashboardPage />} />
                            <Route path="/app/categories" element={<CategoriesPage />} />
                            <Route path="/app/accounts" element={<AccountsPage />} />
                            <Route path="/app/transactions" element={<TransactionsPage />} />
                        </Route>
                    </Route>

                    {/* Catch-all */}
                    <Route element={<AuthLayout />}>
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </Suspense>
        </ErrorBoundary>
    )
}

export function AppRouter() {
    return (
        <BrowserRouter>
            <RouterContent />
        </BrowserRouter>
    )
}
