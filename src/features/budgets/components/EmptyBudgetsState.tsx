import { Target } from 'lucide-react'

type EmptyProps = {
    month: string
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

export function EmptyBudgetsState({ month }: EmptyProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center shadow-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight">No budgets yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating your first budget for {toLabel(month)}.
            </p>
        </div>
    )
}

export default EmptyBudgetsState
