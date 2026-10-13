import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format-currency'
import type { SummaryAccountBreakdown } from '@/features/dashboard/types/summary.types'

type Props = {
    items: SummaryAccountBreakdown[]
}

export const AccountBreakdownCard = ({ items }: Props) => {
    return (
        <Card title={<span className="text-sm">Account breakdown</span>}>
            {items.length === 0 ? (
                <div className="text-sm text-muted-foreground">No accounts to show.</div>
            ) : (
                <ul className="space-y-3">
                    {items.map((a) => (
                        <li key={a.accountId} className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">{a.name}</div>
                                <div className="text-sm text-muted-foreground">{a.type}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold">{formatCurrency(a.netTotal)}</div>
                                <div className="text-sm text-muted-foreground">
                                    {a.transactionCount} tx
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    )
}

export default AccountBreakdownCard
