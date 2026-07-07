import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import { ResetPasswordForm } from '@/features/auth/components'
import { usePasswordRecovery } from '@/features/auth/hooks'

export const ResetPasswordPage = () => {
    const { isLoading, isValid } = usePasswordRecovery()

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <LoadingSpinner aria-label="Verifying reset link" />
            </div>
        )
    }

    if (!isValid) {
        return (
            <>
                <h1 className="sr-only">Reset password</h1>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Link expired or invalid</CardTitle>
                        <CardDescription>
                            This password reset link is invalid or has already been used.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-sm">
                        <Link
                            to="/forgot-password"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Request a new password reset
                        </Link>
                    </CardContent>
                </Card>
            </>
        )
    }

    return (
        <>
            <h1 className="sr-only">Reset your password</h1>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Reset your password</CardTitle>
                    <CardDescription>Choose a strong new password for your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResetPasswordForm />
                </CardContent>
            </Card>
        </>
    )
}
