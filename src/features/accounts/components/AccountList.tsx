import type { Account } from '@/features/accounts/types/account.types'
import { AccountCard } from './AccountCard'

type AccountListProps = {
    accounts: Account[]
    onEdit: (account: Account) => void
    onArchive: (account: Account) => Promise<void> | void
}

export function AccountList({ accounts, onEdit, onArchive }: AccountListProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((a) => (
                <AccountCard key={a.id} account={a} onEdit={onEdit} onArchive={onArchive} />
            ))}
        </div>
    )
}

export default AccountList
