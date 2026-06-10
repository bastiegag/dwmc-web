import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function EmptyDashboardState() {
    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-sm">Nothing to show</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">No transactions for this month.</p>
                <div className="mt-4">
                    <Button asChild>
                        <Link to="/app/transactions">Add transaction</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default EmptyDashboardState
