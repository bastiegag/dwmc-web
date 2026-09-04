import { LoginForm } from '@/features/auth/components'
import { AuthPageCard } from './AuthPageCard'

export const LoginPage = () => {
    return (
        <AuthPageCard
            headingId="login-heading"
            heading="Sign in"
            title="Welcome back"
            description="Sign in to your account to continue"
        >
            <LoginForm />
        </AuthPageCard>
    )
}
