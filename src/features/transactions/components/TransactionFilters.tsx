import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { GetTransactionsParams } from '@/features/transactions/types/transaction.types'
import type { Account } from '@/features/accounts/types/account.types'
import type { SectionWithCategories } from '@/features/categories/types'

type TransactionFiltersProps = {
    accounts: Account[]
    sections: SectionWithCategories[]
    onChange: (filters: GetTransactionsParams) => void
}

export function TransactionFilters({ accounts, sections, onChange }: TransactionFiltersProps) {
    const [type, setType] = useState<string>('')
    const [accountId, setAccountId] = useState<string>('')
    const [categoryId, setCategoryId] = useState<string>('')
    const [month, setMonth] = useState<string>('')
    const [search, setSearch] = useState<string>('')

    useEffect(() => {
        const filters: GetTransactionsParams = {}
        if (type) filters.type = type as GetTransactionsParams['type']
        if (accountId) filters.accountId = accountId
        if (categoryId) filters.categoryId = categoryId
        if (month) filters.month = month
        if (search) filters.search = search
        onChange(filters)
    }, [type, accountId, categoryId, month, search, onChange])

    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <div>
                <Label htmlFor="filter-type">Type</Label>
                <select
                    id="filter-type"
                    className="w-full"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                    <option value="TRANSFER">Transfer</option>
                    <option value="ADJUSTMENT">Adjustment</option>
                </select>
            </div>

            <div>
                <Label htmlFor="filter-account">Account</Label>
                <select
                    id="filter-account"
                    className="w-full"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                >
                    <option value="">All accounts</option>
                    {accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                            {a.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <Label htmlFor="filter-category">Category</Label>
                <select
                    id="filter-category"
                    className="w-full"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option value="">All categories</option>
                    {sections.map((s) => (
                        <optgroup key={s.id} label={s.name}>
                            {s.categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>

            <div>
                <Label htmlFor="filter-month">Month</Label>
                <Input
                    id="filter-month"
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="filter-search">Search</Label>
                <div className="flex gap-2">
                    <Input
                        id="filter-search"
                        placeholder="merchant or note"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button
                        onClick={() => {
                            setType('')
                            setAccountId('')
                            setCategoryId('')
                            setMonth('')
                            setSearch('')
                        }}
                    >
                        Clear
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TransactionFilters
