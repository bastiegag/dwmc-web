import { Card } from '@/components/ui'
import { LoginForm } from '@/features/auth/components'

export const LoginPage = () => (
    <section aria-labelledby="login-heading">
        <h1 id="login-heading" className="sr-only">
            Sign in
        </h1>
        <Card title="Welcome back" description="Sign in to your account to continue">
            <LoginForm />
        </Card>
    </section>
)
