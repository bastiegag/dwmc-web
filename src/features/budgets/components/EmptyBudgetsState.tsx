import { Target } from 'lucide-react'
import { EmptyState } from '@/components/ui'

type EmptyProps = {
    month: string
}

const toLabel = (month: string) => {
    try {
        const [y, m] = month.split('-').map(Number)
        const d = new Date(Date.UTC(y, m - 1, 1))
        return new Intl.DateTimeFormat('en-CA', { month: 'long', year: 'numeric' }).format(d)
    } catch {
        return month
    }
}

export const EmptyBudgetsState = ({ month }: EmptyProps) => {
    return (
        <EmptyState
            icon={Target}
            title="No budgets yet"
            description={`Get started by creating your first budget for ${toLabel(month)}.`}
        />
    )
}

export default EmptyBudgetsState
