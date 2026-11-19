import { useState } from 'react'
import { Button, Card, ConfirmDialog, Progress } from '@/components/ui'
import { formatCurrency } from '@/lib/format-currency'
import type { Account } from '@/features/accounts/types/account.types'
import { getFinanceIconOption } from '@/shared/finance-icons'
import { getSemanticColorClassName } from '@/shared/semantic-colors'

type AccountCardProps = {
    account: Account
    onEdit: (account: Account) => void
    onArchive: (account: Account) => Promise<void> | void
}

export const AccountCard = ({ account, onEdit, onArchive }: AccountCardProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const AccountIcon = getFinanceIconOption(account.icon)?.Component
    const colorClassName = getSemanticColorClassName(account.color)

    const { currentBalance, startingBalance, goal } = account

    const savingsGoal =
        account.type === 'SAVINGS' &&
        goal !== null &&
        goal !== undefined &&
        typeof goal === 'number' &&
        goal > 0
            ? goal
            : null
    const progress =
        savingsGoal === null ? 0 : Math.max(0, Math.min(100, (currentBalance / savingsGoal) * 100))

    return (
        <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span
                        className={`mt-2 inline-block size-3 shrink-0 rounded-full border ${colorClassName ?? ''}`}
                        aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                        <h2 className="flex min-w-0 items-center gap-2 text-lg">
                            {AccountIcon ? (
                                <AccountIcon
                                    className="size-5 shrink-0 text-muted-foreground"
                                    aria-hidden="true"
                                />
                            ) : null}
                            <span className="min-w-0 break-words">{account.name}</span>
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {String(account.type).replace(/_/g, ' ')}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="link"
                        className="min-h-11 no-underline hover:bg-accent/10"
                        onClick={() => onEdit(account)}
                        aria-label={`Edit ${account.name}`}
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="link"
                        className="min-h-11 no-underline hover:bg-accent/10"
                        onClick={() => {
                            setIsConfirmOpen(true)
                        }}
                        aria-label={`Archive ${account.name}`}
                    >
                        Archive
                    </Button>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="break-words text-2xl font-semibold tabular-nums">
                        {formatCurrency(currentBalance)}
                    </div>
                    <div className="break-words text-sm text-muted-foreground tabular-nums">
                        Starting: {formatCurrency(startingBalance)}
                    </div>
                </div>

                {savingsGoal !== null ? (
                    <div className="min-w-40 max-w-full flex-1 text-right">
                        <div className="break-words text-sm text-muted-foreground tabular-nums">
                            Savings goal: {formatCurrency(savingsGoal)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                            {Math.round(progress)}% complete
                        </div>
                        <Progress
                            className="mt-2"
                            value={progress}
                            aria-label={`Progress toward savings goal for ${account.name}`}
                            aria-valuetext={`${Math.round(progress)}% complete`}
                        />
                    </div>
                ) : null}
            </div>

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Archive account?"
                description={
                    <>
                        This will archive <strong>{account.name}</strong>.
                    </>
                }
                confirmLabel="Archive"
                pendingLabel="Archiving..."
                errorFallback="Unable to archive account. Please try again."
                variant="destructive"
                onConfirm={() => onArchive(account)}
            />
        </Card>
    )
}

export default AccountCard
