import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format-currency'
import type { SummaryRecentTransaction } from '@/features/dashboard/types/summary.types'
import { Link } from 'react-router-dom'

type Props = {
    transactions: SummaryRecentTransaction[]
}

export const RecentTransactionsCard = ({ transactions }: Props) => {
    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-sm">Recent transactions</CardTitle>
            </CardHeader>
            <CardContent>
                {transactions.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No recent transactions.</div>
                ) : (
                    <ul className="space-y-3">
                        {transactions.map((t) => (
                            <li key={t.id} className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">
                                        {t.merchant ?? t.note ?? 'No description'}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {t.date.slice(0, 10)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold">{formatCurrency(t.amount)}</div>
                                    <div className="text-sm text-muted-foreground">{t.type}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-4 text-right">
                    <Link to="/transactions" className="text-sm text-primary">
                        View all transactions
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default RecentTransactionsCard
