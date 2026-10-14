import { AuthForm } from '../auth-form'

export default function SignupPage() {
    return (
        <main className="mx-auto flex min-h-dvh max-w-md items-center px-6">
            <AuthForm mode="signup" />
        </main>
    )
}
