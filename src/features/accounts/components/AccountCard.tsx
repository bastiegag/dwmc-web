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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDialogFocus } from '@/shared/dialog'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/format-currency'
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
    const { dialogRef, handleKeyDown } = useDialogFocus({
        open: isConfirmOpen,
        onClose: () => setIsConfirmOpen(false),
    })
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
            <CardHeader className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span
                        className="inline-block h-3 w-3 rounded-full border"
                        style={{ backgroundColor: account.color }}
                        aria-hidden="true"
                    />
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            {createElement(iconComp, {
                                className: 'h-5 w-5 text-muted-foreground',
                                'aria-hidden': true,
                            })}
                            <span>{account.name}</span>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {String(account.type).replace(/_/g, ' ')}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(account)}
                        aria-label={`Edit ${account.name}`}
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsConfirmOpen(true)}
                        aria-label={`Archive ${account.name}`}
                    >
                        Archive
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
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
            </CardContent>

            {isConfirmOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <dialog
                        ref={dialogRef}
                        onKeyDown={handleKeyDown}
                        tabIndex={-1}
                        role="alertdialog"
                        aria-labelledby={`archive-account-${account.id}`}
                        aria-modal="true"
                        className="w-full max-w-sm rounded-lg border bg-background p-4 shadow-lg"
                        open
                    >
                        <h3
                            id={`archive-account-${account.id}`}
                            className="text-base font-semibold"
                        >
                            Archive account?
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            This will archive <strong>{account.name}</strong>.
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsConfirmOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={async () => {
                                    await onArchive(account)
                                    setIsConfirmOpen(false)
                                }}
                            >
                                Archive
                            </Button>
                        </div>
                    </dialog>
                </div>
            ) : null}
        </Card>
    )
}

export default AccountCard
