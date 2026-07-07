import type { Budget } from '@/features/budgets/types/budget.types'
import BudgetCard from './BudgetCard'

type Props = {
    budgets: Budget[]
    onEdit: (b: Budget) => void
    onArchive: (b: Budget) => Promise<void> | void
}

export const BudgetList = ({ budgets, onEdit, onArchive }: Props) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {budgets.map((b) => (
                <BudgetCard key={b.id} budget={b} onEdit={onEdit} onArchive={onArchive} />
            ))}
        </div>
    )
}

export default BudgetList
