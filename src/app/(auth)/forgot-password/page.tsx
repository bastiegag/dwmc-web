import { AuthForm } from '../auth-form'

export default function ForgotPasswordPage() {
    return (
        <main className="mx-auto flex min-h-dvh max-w-md items-center px-6">
            <AuthForm mode="forgot" />
        </main>
    )
}
