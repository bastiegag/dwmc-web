import { useState, type FC } from 'react'
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
import type { Budget } from '@/features/budgets/types/budget.types'
import { getErrorMessage } from '@/shared/errors'

type Props = {
    budget: Budget
    onEdit: (b: Budget) => void
    onArchive: (b: Budget) => Promise<void> | void
}

export const BudgetCard: FC<Props> = ({ budget, onEdit, onArchive }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [archiveError, setArchiveError] = useState<string | null>(null)
    const [isArchiving, setIsArchiving] = useState(false)

    const { category } = budget

    return (
        <Card>
            <div className="flex items-center justify-between gap-4">
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
                        variant="link"
                        className="no-underline hover:bg-accent/10"
                        size="sm"
                        onClick={() => onEdit(budget)}
                        aria-label={`Edit ${category.name}`}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        size="sm"
                        onClick={() => {
                            setArchiveError(null)
                            setIsConfirmOpen(true)
                        }}
                        aria-label={`Archive ${category.name}`}
                    >
                        Archive
                    </Button>
                </div>
            </div>

            <div className="mt-4">
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
            </div>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Archive budget?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will archive the budget for <strong>{category.name}</strong> (
                            {budget.month}).
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
                            disabled={isArchiving}
                            render={
                                <Button type="button" color="destructive" variant="contained">
                                    {isArchiving ? 'Archiving...' : 'Archive'}
                                </Button>
                            }
                            onClick={async (event) => {
                                event.preventDefault()
                                setIsArchiving(true)
                                setArchiveError(null)
                                try {
                                    await onArchive(budget)
                                    setIsConfirmOpen(false)
                                } catch (error) {
                                    setArchiveError(
                                        getErrorMessage(
                                            error,
                                            'Unable to archive budget. Please try again.',
                                        ),
                                    )
                                } finally {
                                    setIsArchiving(false)
                                }
                            }}
                        />
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}

export default BudgetCard
