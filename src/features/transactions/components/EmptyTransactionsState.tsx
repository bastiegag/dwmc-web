import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type EmptyTransactionsStateProps = {
    onCreate: () => void
}

export function EmptyTransactionsState({ onCreate }: EmptyTransactionsStateProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>No transactions yet</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    You have not added any transactions.
                </p>
                <Button onClick={onCreate}>Add your first transaction</Button>
            </CardContent>
        </Card>
    )
}

export default EmptyTransactionsState
