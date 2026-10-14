import { cookies } from 'next/headers'
import { ResetPasswordForm } from './reset-password-form'

export default async function ResetPasswordPage() {
    const recoveryCookie = (await cookies()).get('dwmc-recovery')?.value

    if (recoveryCookie !== '1') {
        return (
            <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6">
                <h1>Link expired or invalid</h1>
                <a href="/forgot-password">Request a new password reset</a>
            </main>
        )
    }

    return <ResetPasswordForm />
}
