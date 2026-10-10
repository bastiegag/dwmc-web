import { Card } from '@/components/ui'
import { ForgotPasswordForm } from '@/features/auth/components'

export const ForgotPasswordPage = () => (
    <section aria-labelledby="forgot-password-heading">
        <h1 id="forgot-password-heading" className="sr-only">
            Reset password
        </h1>
        <Card
            title="Forgot password?"
            description="Enter your email and we'll send you a reset link"
        >
            <ForgotPasswordForm />
        </Card>
    </section>
)
