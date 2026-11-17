import { AlertCircle } from 'lucide-react'
import { QueryState } from '@/components/feedback'
import { Alert } from '@/components/ui'
import { useAuth } from '@/features/auth'
import { getErrorMessage } from '@/shared/errors'
import { useProfile } from '../hooks'
import { ProfileForm } from '../components/ProfileForm'

export const ProfilePage = () => {
    const { user } = useAuth()
    const profile = useProfile()
    const hasProfile = profile.data !== undefined

    return (
        <section className="space-y-6 px-4 sm:px-6 lg:px-8" aria-labelledby="profile-heading">
            <div>
                <h1 id="profile-heading" className="text-2xl font-bold">
                    Profile
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your personal information and profile preferences.
                </p>
            </div>
            <QueryState
                isLoading={profile.isLoading && !hasProfile}
                isError={profile.isError && !hasProfile}
                loadingLabel="Loading profile"
                errorTitle="Could not load profile"
                errorMessage={getErrorMessage(profile.error, '')}
                fallbackErrorMessage="Unable to load your profile. Please try again."
                onRetry={() => void profile.refetch()}
            />
            {profile.isError && hasProfile ? (
                <Alert
                    variant="warning"
                    role="status"
                    title="Profile refresh failed"
                    description={
                        getErrorMessage(profile.error, '') || 'Please try again in a moment.'
                    }
                    action={{
                        label: 'Retry',
                        disabled: profile.isFetching,
                        onClick: () => void profile.refetch(),
                    }}
                />
            ) : null}
            {hasProfile ? (
                <>
                    <div className="max-w-2xl rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                        <section
                            aria-labelledby="account-information-heading"
                            className="mb-8 space-y-3"
                        >
                            <h2 id="account-information-heading" className="text-lg font-semibold">
                                Account information
                            </h2>
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="font-medium">Email</span>
                                <span className="break-all text-muted-foreground">
                                    {user?.email ?? 'Unavailable'}
                                </span>
                                <span className="sr-only">Read-only</span>
                            </div>
                        </section>
                        <ProfileForm
                            key={`${profile.data.authUserId}:${profile.data.id}`}
                            profile={profile.data}
                        />
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        <p>
                            Financial amounts keep their existing meaning when this preference
                            changes.
                        </p>
                    </div>
                </>
            ) : null}
        </section>
    )
}
