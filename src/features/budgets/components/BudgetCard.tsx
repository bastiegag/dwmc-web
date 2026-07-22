import { useState, type FC } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/format-currency'
import type { Budget } from '@/features/budgets/types/budget.types'

type Props = {
    budget: Budget
    onEdit: (b: Budget) => void
    onArchive: (b: Budget) => Promise<void> | void
}

export const BudgetCard: FC<Props> = ({ budget, onEdit, onArchive }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const { category } = budget

    return (
        <Card>
            <CardHeader className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: category.section.color,
                        }}
                        aria-hidden="true"
                    />
                    <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">{category.section.name}</div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(budget)}
                        aria-label={`Edit ${category.name}`}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsConfirmOpen(true)}
                        aria-label={`Archive ${category.name}`}
                    >
                        Archive
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className="mb-3 flex items-end justify-between">
                    <div>
                        <div className="text-2xl font-semibold">
                            {formatCurrency(budget.amount)}
                        </div>
                        <div className="text-sm text-muted-foreground">Planned</div>
                    </div>

                    <div className="text-right">
                        <div className="text-sm">Spent</div>
                        <div className="font-medium">{formatCurrency(budget.spent)}</div>
                    </div>
                </div>

                <div className="mb-3">
                    <Progress
                        value={Math.min(budget.progress, 100)}
                        indicatorClassName={budget.isOverBudget ? 'bg-destructive' : 'bg-primary'}
                    />
                    <div className="mt-2 flex items-center justify-between text-sm">
                        <div>{Math.round(budget.progress)}% used</div>
                        <div>
                            {budget.remaining >= 0 ? (
                                <span className="text-sm text-muted-foreground">
                                    Remaining: {formatCurrency(budget.remaining)}
                                </span>
                            ) : (
                                <span className="text-sm text-destructive">
                                    Over budget: {formatCurrency(Math.abs(budget.remaining))}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-sm text-muted-foreground">
                    {budget.transactionCount} transaction{budget.transactionCount !== 1 ? 's' : ''}
                </div>
            </CardContent>

            {isConfirmOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        className="w-full max-w-sm rounded-lg border bg-background p-4 shadow-lg"
                    >
                        <h3 className="text-base font-semibold">Archive budget?</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            This will archive the budget for <strong>{category.name}</strong> (
                            {budget.month}).
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
                                    await onArchive(budget)
                                    setIsConfirmOpen(false)
                                }}
                            >
                                Archive
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </Card>
    )
}

export default BudgetCard
