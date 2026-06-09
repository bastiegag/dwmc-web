import { Button } from '@/components/ui/button'

type AccountsPageHeaderProps = {
    onCreate: () => void
}

export function AccountsPageHeader({ onCreate }: AccountsPageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 id="accounts-heading" className="text-3xl font-bold tracking-tight">
                    Accounts
                </h1>
                <p className="text-sm text-muted-foreground">
                    Manage accounts where your money lives
                </p>
            </div>

            <div>
                <Button onClick={onCreate}>New account</Button>
            </div>
        </div>
    )
}

export default AccountsPageHeader
