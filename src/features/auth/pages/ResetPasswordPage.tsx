import { Link } from 'react-router-dom'
import { LoadingSpinner } from '@/components/feedback'
import { ResetPasswordForm } from '@/features/auth/components'
import { usePasswordRecovery } from '@/features/auth/hooks'
import { AuthPageCard } from './AuthPageCard'

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
            <AuthPageCard
                headingId="reset-password-error-heading"
                heading="Reset password"
                title="Link expired or invalid"
                description="This password reset link is invalid or has already been used."
            >
                <div className="text-center text-sm">
                    <Link
                        to="/forgot-password"
                        className="text-primary underline underline-offset-4 hover:underline"
                    >
                        Request a new password reset
                    </Link>
                </div>
            </AuthPageCard>
        )
    }

    return (
        <AuthPageCard
            headingId="reset-password-heading"
            heading="Reset your password"
            title="Reset your password"
            description="Choose a strong new password for your account"
        >
            <ResetPasswordForm />
        </AuthPageCard>
    )
}
