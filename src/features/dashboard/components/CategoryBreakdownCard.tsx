import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format-currency'
import type { SummaryCategoryBreakdown } from '@/features/dashboard/types/summary.types'

type Props = {
    title: string
    items: SummaryCategoryBreakdown[]
}

export const CategoryBreakdownCard = ({ title, items }: Props) => {
    return (
        <Card title={<span className="text-sm">{title}</span>}>
            {items.length === 0 ? (
                <div className="text-sm text-muted-foreground">No categories to show.</div>
            ) : (
                <ul className="space-y-3">
                    {items.map((it) => (
                        <li
                            key={String(it.categoryId)}
                            className="flex items-center justify-between"
                        >
                            <div>
                                <div className="font-medium">{it.name}</div>
                                <div className="text-sm text-muted-foreground">
                                    {it.transactionCount} tx
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold">{formatCurrency(it.total)}</div>
                                <div className="text-sm text-muted-foreground">
                                    {Math.round(it.percentage)}%
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    )
}

export default CategoryBreakdownCard
