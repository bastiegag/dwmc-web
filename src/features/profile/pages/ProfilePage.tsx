import { AlertCircle } from 'lucide-react'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import { FormError } from '@/components/form/FormError'
import { useAuth } from '@/features/auth/hooks'
import { useProfile } from '../hooks'
import { ProfileForm } from '../components/ProfileForm'

export const ProfilePage = () => {
    const { user } = useAuth()
    const profile = useProfile()

    if (profile.isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center" role="status">
                <LoadingSpinner size="lg" aria-label="Loading profile" />
            </div>
        )
    }

    if (profile.isError || !profile.data) {
        return (
            <section className="space-y-4 px-4 sm:px-6 lg:px-8" aria-labelledby="profile-heading">
                <h1 id="profile-heading" className="text-2xl font-bold tracking-tight">
                    Profile
                </h1>
                <FormError message={profile.error?.message ?? 'Unable to load your profile.'} />
                <button
                    type="button"
                    className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
                    onClick={() => void profile.refetch()}
                >
                    Try again
                </button>
            </section>
        )
    }

    return (
        <section className="space-y-6 px-4 sm:px-6 lg:px-8" aria-labelledby="profile-heading">
            <div>
                <h1 id="profile-heading" className="text-2xl font-bold tracking-tight">
                    Profile
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your personal information and profile preferences.
                </p>
            </div>
            <div className="max-w-2xl rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <section aria-labelledby="account-information-heading" className="mb-8 space-y-3">
                    <h2 id="account-information-heading" className="text-lg font-semibold">
                        Account information
                    </h2>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Email</span>
                        <span className="text-muted-foreground">
                            {user?.email ?? 'Unavailable'}
                        </span>
                        <span className="sr-only">Read-only</span>
                    </div>
                </section>
                <ProfileForm profile={profile.data} />
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p>Financial amounts keep their existing meaning when this preference changes.</p>
            </div>
        </section>
    )
}
