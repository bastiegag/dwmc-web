import { useState, useMemo, createElement } from 'react'
import {
    Archive,
    Banknote,
    CreditCard,
    Coins,
    DollarSign,
    Landmark,
    ShoppingBag,
    ShoppingCart,
    Shield,
    Wallet,
} from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Button,
    Card,
    Progress,
} from '@/components/ui'
import { formatCurrency } from '@/lib/format-currency'
import { getErrorMessage } from '@/shared/errors'
import type { Account } from '@/features/accounts/types/account.types'

const accountIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    archive: Archive,
    banknote: Banknote,
    'credit-card': CreditCard,
    coins: Coins,
    'dollar-sign': DollarSign,
    landmark: Landmark,
    'shopping-bag': ShoppingBag,
    'shopping-cart': ShoppingCart,
    shield: Shield,
    wallet: Wallet,
}

const getIconComponent = (name: string) => accountIcons[name] ?? Wallet

type AccountCardProps = {
    account: Account
    onEdit: (account: Account) => void
    onArchive: (account: Account) => Promise<void> | void
}

export const AccountCard = ({ account, onEdit, onArchive }: AccountCardProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [archiveError, setArchiveError] = useState<string | null>(null)
    const [isArchiving, setIsArchiving] = useState(false)
    const iconComp = useMemo(() => getIconComponent(account.icon), [account.icon])

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
                        className="mt-2 inline-block size-3 shrink-0 rounded-full border"
                        style={{ backgroundColor: account.color }}
                        aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                        <h2 className="flex min-w-0 items-center gap-2 text-lg">
                            {createElement(iconComp, {
                                className: 'size-5 shrink-0 text-muted-foreground',
                                'aria-hidden': true,
                            })}
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
                            setArchiveError(null)
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

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Archive account?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will archive <strong>{account.name}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {archiveError ? (
                        <p role="alert" className="text-sm text-destructive">
                            {archiveError}
                        </p>
                    ) : null}
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            asChild
                            disabled={isArchiving}
                            onClick={async (event) => {
                                event.preventDefault()
                                setIsArchiving(true)
                                setArchiveError(null)
                                try {
                                    await onArchive(account)
                                    setIsConfirmOpen(false)
                                } catch (error) {
                                    setArchiveError(
                                        getErrorMessage(
                                            error,
                                            'Unable to archive account. Please try again.',
                                        ),
                                    )
                                } finally {
                                    setIsArchiving(false)
                                }
                            }}
                        >
                            <Button type="button" color="destructive" variant="contained">
                                {isArchiving ? 'Archiving...' : 'Archive'}
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}

export default AccountCard
