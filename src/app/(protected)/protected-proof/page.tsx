import { serverApiClient } from '@/lib/api-client.server'
import { LogoutButton } from '../logout-button'

type AuthMeResponse = {
    data: { user: { id: string; email?: string }; profile: { authUserId: string } }
}

export default async function ProtectedProofPage() {
    const response = await serverApiClient<AuthMeResponse>('/auth/me')
    return (
        <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-4 px-6">
            <p className="text-body-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Protected SSR proof
            </p>
            <h1 className="text-heading-xl font-bold">Authenticated request verified</h1>
            <p>
                Supabase user: <strong>{response.data.user.email ?? response.data.user.id}</strong>
            </p>
            <LogoutButton />
        </main>
    )
}
