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
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Progress } from '@/components/ui/progress'
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

    const showGoal =
        account.type === 'SAVINGS' &&
        goal !== null &&
        goal !== undefined &&
        typeof goal === 'number' &&
        goal > 0
    const progress =
        showGoal && goal > 0 ? Math.max(0, Math.min(100, (currentBalance / goal) * 100)) : 0

    return (
        <Card>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span
                        className="inline-block h-3 w-3 rounded-full border"
                        style={{ backgroundColor: account.color }}
                        aria-hidden="true"
                    />
                    <div>
                        <h2 className="flex items-center gap-2 text-lg">
                            {createElement(iconComp, {
                                className: 'h-5 w-5 text-muted-foreground',
                                'aria-hidden': true,
                            })}
                            <span>{account.name}</span>
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
                        className="no-underline hover:bg-accent/10"
                        onClick={() => onEdit(account)}
                        aria-label={`Edit ${account.name}`}
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="link"
                        className="no-underline hover:bg-accent/10"
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

            <div className="mt-4">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-2xl font-semibold">
                            {formatCurrency(currentBalance)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Starting: {formatCurrency(startingBalance)}
                        </div>
                    </div>

                    <div className="w-40 text-right">
                        {showGoal ? (
                            <div>
                                <div className="text-sm text-muted-foreground">
                                    Savings goal: {formatCurrency(goal!)}
                                </div>
                                <Progress className="mt-2" value={progress} />
                            </div>
                        ) : null}
                    </div>
                </div>
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
