import SummaryCard from './SummaryCard'
import type { MonthlySummary } from '@/features/dashboard/types/summary.types'

type SummaryCardsProps = {
    totals: MonthlySummary['totals']
}

export const SummaryCards = ({ totals }: SummaryCardsProps) => {
    const { incomeTotal, expenseTotal, netTotal, transactionCount } = totals

    const netSubtitle = netTotal < 0 ? `Net loss` : netTotal > 0 ? `Net income` : `Break-even`

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="Income" value={incomeTotal} />
            <SummaryCard label="Expenses" value={expenseTotal} />
            <SummaryCard label="Net" value={netTotal} subtitle={netSubtitle} />
            <SummaryCard label="Transactions" value={transactionCount} />
        </div>
    )
}

export default SummaryCards
