import { AuthForm } from '../auth-form'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; next?: string }>
}) {
    const params = await searchParams
    return (
        <main className="mx-auto flex min-h-dvh max-w-md items-center px-6">
            <AuthForm mode="login" initialError={Boolean(params.error)} nextPath={params.next} />
        </main>
    )
}
