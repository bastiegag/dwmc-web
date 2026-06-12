import { Button } from '@/components/ui/button'

type BudgetsPageHeaderProps = {
    onCreate: () => void
}

export function BudgetsPageHeader({ onCreate }: BudgetsPageHeaderProps) {
    return (
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-2xl font-semibold">Budgets</h1>
                <p className="text-sm text-muted-foreground">
                    Manage monthly spending targets by category.
                </p>
            </div>

            <div>
                <Button onClick={onCreate}>Create budget</Button>
            </div>
        </div>
    )
}

export default BudgetsPageHeader
