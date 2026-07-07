import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
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
        <Card>
            <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{label}</CardTitle>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold">{display}</div>
                {subtitle ? (
                    <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>
                ) : null}
            </CardContent>
        </Card>
    )
}

export default SummaryCard
