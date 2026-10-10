import { Card } from '@/components/ui'
import { SignupForm } from '@/features/auth/components'

export const SignupPage = () => (
    <section aria-labelledby="signup-heading">
        <h1 id="signup-heading" className="sr-only">
            Create account
        </h1>
        <Card title="Create an account" description="Start managing your finances today">
            <SignupForm />
        </Card>
    </section>
)
