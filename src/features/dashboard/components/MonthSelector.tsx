import { Button } from '@/components/ui/button'
import { useMemo } from 'react'

type MonthSelectorProps = {
    month: string // YYYY-MM
    onChange: (month: string) => void
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

function addMonth(month: string, delta: number) {
    const [y, m] = month.split('-').map(Number)
    const d = new Date(y, m - 1 + delta, 1)
    const mm =
        String(d.getFullYear()).padStart(4, '0') + '-' + String(d.getMonth() + 1).padStart(2, '0')
    return mm
}

export function MonthSelector({ month, onChange }: MonthSelectorProps) {
    const label = useMemo(() => toLabel(month), [month])

    return (
        <div className="flex items-center gap-3">
            <Button
                aria-label="Previous month"
                variant="ghost"
                onClick={() => onChange(addMonth(month, -1))}
            >
                ◀
            </Button>
            <div className="font-medium">{label}</div>
            <Button
                aria-label="Next month"
                variant="ghost"
                onClick={() => onChange(addMonth(month, 1))}
            >
                ▶
            </Button>
        </div>
    )
}

export default MonthSelector
