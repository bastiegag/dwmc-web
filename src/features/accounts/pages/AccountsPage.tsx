import { useMemo, useState, useCallback } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import { ApiError } from '@/lib/api-client'
import type { Account } from '@/features/accounts/types/account.types'
import type { AccountFormValues } from '@/features/accounts/schemas/account.schema'
import {
    useAccounts,
    useCreateAccount,
    useUpdateAccount,
    useDeleteAccount,
} from '@/features/accounts/hooks'
import {
    AccountsPageHeader,
    AccountDialog,
    EmptyAccountsState,
    AccountList,
} from '@/features/accounts/components'
import { usePrimaryAction } from '@/shared/primary-action'

const toErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof ApiError) return error.message
    if (error instanceof Error) return error.message
    return fallback
}

export const AccountsPage = () => {
    const accountsQuery = useAccounts()
    const createMutation = useCreateAccount()
    const updateMutation = useUpdateAccount()
    const deleteMutation = useDeleteAccount()

    const [isDialogOpen, setDialogOpen] = useState(false)
    const [activeAccount, setActiveAccount] = useState<Account | null>(null)
    const [formError, setFormError] = useState<string | null>(null)
    const [archiveError, setArchiveError] = useState<string | null>(null)

    const openCreate = useCallback(() => {
        setActiveAccount(null)
        setFormError(null)
        setDialogOpen(true)
    }, [])

    usePrimaryAction({
        label: 'Add account',
        onClick: openCreate,
    })

    const accounts = accountsQuery.data ?? []

    const initialValues = useMemo(() => {
        if (!activeAccount) return undefined
        return {
            name: activeAccount.name,
            type: activeAccount.type,
            startingBalance: activeAccount.startingBalance,
            goal: activeAccount.goal,
            color: activeAccount.color,
            icon: activeAccount.icon,
        } as AccountFormValues
    }, [activeAccount])

    const closeDialog = () => {
        setDialogOpen(false)
        setActiveAccount(null)
        setFormError(null)
    }

    const handleSubmit = async (values: AccountFormValues) => {
        try {
            if (activeAccount) {
                await updateMutation.mutateAsync({ id: activeAccount.id, input: values })
            } else {
                await createMutation.mutateAsync(values)
            }
            closeDialog()
        } catch (error) {
            setFormError(toErrorMessage(error, 'Unable to save account. Please try again.'))
        }
    }

    const handleArchive = async (account: Account) => {
        try {
            setArchiveError(null)
            await deleteMutation.mutateAsync(account.id)
        } catch (error) {
            setArchiveError(toErrorMessage(error, 'Unable to archive account. Please try again.'))
        }
    }

    return (
        <section className="space-y-6" aria-labelledby="accounts-heading">
            <AccountsPageHeader />

            {accountsQuery.isLoading ? (
                <div className="py-6" role="status" aria-live="polite">
                    <LoadingSpinner aria-label="Loading accounts" />
                </div>
            ) : null}

            {accountsQuery.isError ? (
                <Alert variant="destructive">
                    <AlertTitle>Could not load accounts</AlertTitle>
                    <AlertDescription>
                        {toErrorMessage(
                            accountsQuery.error,
                            'Please refresh and try again in a moment.',
                        )}
                    </AlertDescription>
                </Alert>
            ) : null}

            {archiveError ? (
                <Alert variant="destructive">
                    <AlertTitle>Archive failed</AlertTitle>
                    <AlertDescription>{archiveError}</AlertDescription>
                </Alert>
            ) : null}

            {!accountsQuery.isLoading && !accountsQuery.isError && accounts.length === 0 ? (
                <EmptyAccountsState />
            ) : null}

            {!accountsQuery.isLoading && !accountsQuery.isError && accounts.length > 0 ? (
                <AccountList
                    accounts={accounts}
                    onEdit={(a) => {
                        setActiveAccount(a)
                        setFormError(null)
                        setDialogOpen(true)
                    }}
                    onArchive={handleArchive}
                />
            ) : null}

            <AccountDialog
                open={isDialogOpen}
                mode={activeAccount ? 'edit' : 'create'}
                initialValues={initialValues}
                isPending={createMutation.isPending || updateMutation.isPending}
                errorMessage={formError}
                onOpenChange={(open) => {
                    if (!open) closeDialog()
                }}
                onSubmit={handleSubmit}
            />
        </section>
    )
}
export default AccountsPage
