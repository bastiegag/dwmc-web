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
    const progress = Number.isFinite(budget.progress) ? budget.progress : 0
    const isZeroLimitOverBudget = budget.amount === 0 && budget.isOverBudget
    const progressText = isZeroLimitOverBudget
        ? 'Percentage unavailable for a zero budget limit'
        : `${Math.round(progress)}% used`
    const progressValueText = isZeroLimitOverBudget
        ? `Over budget by ${formatCurrency(Math.abs(budget.remaining))}. Percentage unavailable because the budget limit is zero.`
        : progress > 100
          ? `${Math.round(progress)}% used. The progress bar is capped at 100%.`
          : progressText

    return (
        <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: category.section.color,
                        }}
                        aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                        <h2 className="break-words font-medium">{category.name}</h2>
                        <p className="break-words text-sm text-muted-foreground">
                            {category.section.name}
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                        variant="link"
                        className="min-h-11 no-underline hover:bg-accent/10"
                        size="sm"
                        onClick={() => onEdit(budget)}
                        aria-label={`Edit ${category.name}`}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        className="min-h-11"
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

            <div className="mt-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="min-w-0">
                        <p className="break-words text-2xl font-semibold tabular-nums">
                            {formatCurrency(budget.amount)}
                        </p>
                        <p className="text-sm text-muted-foreground">Planned</p>
                    </div>

                    <div className="min-w-0 sm:text-right">
                        <p className="text-sm">Spent</p>
                        <p className="break-words font-medium tabular-nums">
                            {formatCurrency(budget.spent)}
                        </p>
                    </div>
                </div>

                <div>
                    <Progress
                        value={progress}
                        indicatorClassName={budget.isOverBudget ? 'bg-destructive' : 'bg-primary'}
                        aria-label={`Budget usage for ${category.name}`}
                        aria-valuetext={progressValueText}
                    />
                    <div className="mt-2 flex flex-wrap items-start justify-between gap-x-4 gap-y-1 text-sm">
                        <p className="break-words">{progressText}</p>
                        <p className="break-words text-right tabular-nums">
                            {budget.isOverBudget ? (
                                <span className="text-destructive">
                                    Over budget: {formatCurrency(Math.abs(budget.remaining))}
                                </span>
                            ) : (
                                <span className="text-sm text-muted-foreground">
                                    Remaining: {formatCurrency(budget.remaining)}
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="text-sm text-muted-foreground">
                    {budget.transactionCount} transaction
                    {budget.transactionCount !== 1 ? 's' : ''}
                </div>
            </div>

            <AlertDialog
                open={isConfirmOpen}
                onOpenChange={(open, eventDetails) => {
                    if (!open && isArchiving) {
                        eventDetails.cancel()
                        return
                    }
                    setIsConfirmOpen(open)
                }}
            >
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
                            asChild
                            disabled={isArchiving}
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

export default BudgetCard
