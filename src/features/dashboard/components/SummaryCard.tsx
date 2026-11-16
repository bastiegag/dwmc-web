import { Card } from '@/components/ui'
import { formatCurrency } from '@/lib/format-currency'
import type { ReactNode } from 'react'

type SummaryCardProps = {
    label: string
    value: number | string
    subtitle?: string
    icon?: ReactNode
}

export const SummaryCard = ({ label, value, subtitle, icon }: SummaryCardProps) => {
    const display = typeof value === 'number' ? formatCurrency(value) : String(value)
    return (
        <Card
            className="min-w-0"
            title={
                <div className="flex items-center justify-between text-sm">
                    {label}
                    {icon}
                </div>
            }
        >
            <div className="min-w-0 break-words text-2xl font-semibold tabular-nums">{display}</div>
            {subtitle ? <div className="text-sm text-muted-foreground mt-1">{subtitle}</div> : null}
        </Card>
    )
}

export default SummaryCard
