import { Button } from '@/components/ui/button'
import { Target } from 'lucide-react'

type EmptyProps = {
    month: string
    onCreate: () => void
}

function toLabel(month: string) {
    try {
        const [y, m] = month.split('-').map(Number)
        const d = new Date(Date.UTC(y, m - 1, 1))
        return new Intl.DateTimeFormat('en-CA', { month: 'long', year: 'numeric' }).format(d)
    } catch {
        return month
    }
}

export function EmptyBudgetsState({ month, onCreate }: EmptyProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-8 text-center">
            <Target className="size-10 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No budgets for {toLabel(month)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Create a budget to track spending for a category.
            </p>
            <div className="mt-4">
                <Button onClick={onCreate}>Create budget</Button>
            </div>
        </div>
    )
}

export default EmptyBudgetsState
