import { AuthForm } from '../auth-form'

export default async function SignupPage({
    searchParams,
}: {
    searchParams: Promise<{ next?: string }>
}) {
    const params = await searchParams
    return (
        <main className="mx-auto flex min-h-dvh max-w-md items-center px-6">
            <AuthForm mode="signup" nextPath={params.next} />
        </main>
    )
}
