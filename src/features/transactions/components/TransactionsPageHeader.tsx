import { Button } from '@/components/ui/button'

type TransactionsPageHeaderProps = {
    onCreate: () => void
}

export function TransactionsPageHeader({ onCreate }: TransactionsPageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 id="transactions-heading" className="text-3xl font-bold tracking-tight">
                    Transactions
                </h1>
                <p className="text-sm text-muted-foreground">Log and manage your transactions</p>
            </div>

            <div>
                <Button onClick={onCreate}>New transaction</Button>
            </div>
        </div>
    )
}

export default TransactionsPageHeader
