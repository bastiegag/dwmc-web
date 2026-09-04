import { ForgotPasswordForm } from '@/features/auth/components'
import { AuthPageCard } from './AuthPageCard'

export const ForgotPasswordPage = () => {
    return (
        <AuthPageCard
            headingId="forgot-password-heading"
            heading="Reset password"
            title="Forgot password?"
            description={<>Enter your email and we&apos;ll send you a reset link</>}
        >
            <ForgotPasswordForm />
        </AuthPageCard>
    )
}
