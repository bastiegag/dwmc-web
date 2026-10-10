import type { ReactNode } from 'react'
import { LoadingSpinner } from '@/components/feedback'
import { AppLink, Card } from '@/components/ui'
import { ResetPasswordForm } from '@/features/auth/components'
import { usePasswordRecovery } from '@/features/auth/hooks'

interface ResetPasswordCardProps {
    heading: string
    title: string
    description: string
    children: ReactNode
}

const ResetPasswordCard = ({ heading, title, description, children }: ResetPasswordCardProps) => (
    <section aria-labelledby={heading}>
        <h1 id={heading} className="sr-only">
            {heading}
        </h1>
        <Card title={title} description={description}>
            {children}
        </Card>
    </section>
)

export const ResetPasswordPage = () => {
    const { isLoading, isValid } = usePasswordRecovery()

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <LoadingSpinner aria-label="Verifying reset link" />
            </div>
        )
    }

    if (!isValid) {
        return (
            <ResetPasswordCard
                heading="reset-password-error-heading"
                title="Link expired or invalid"
                description="This password reset link is invalid or has already been used."
            >
                <div className="text-center text-sm">
                    <AppLink to="/forgot-password">Request a new password reset</AppLink>
                </div>
            </ResetPasswordCard>
        )
    }

    return (
        <ResetPasswordCard
            heading="reset-password-heading"
            title="Reset your password"
            description="Choose a strong new password for your account"
        >
            <ResetPasswordForm />
        </ResetPasswordCard>
    )
}
