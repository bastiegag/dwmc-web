import { SignupForm } from '@/features/auth/components'
import { AuthPageCard } from './AuthPageCard'

export const SignupPage = () => {
    return (
        <AuthPageCard
            headingId="signup-heading"
            heading="Create account"
            title="Create an account"
            description="Start managing your finances today"
        >
            <SignupForm />
        </AuthPageCard>
    )
}
