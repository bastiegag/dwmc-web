import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format-currency'
import type { SummaryAccountBreakdown } from '@/features/dashboard/types/summary.types'

type Props = {
    items: SummaryAccountBreakdown[]
}

export function AccountBreakdownCard({ items }: Props) {
    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-sm">Account breakdown</CardTitle>
            </CardHeader>
            <CardContent>
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
                                    <div className="font-semibold">
                                        {formatCurrency(a.netTotal)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {a.transactionCount} tx
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}

export default AccountBreakdownCard
