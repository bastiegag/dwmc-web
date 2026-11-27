import { useState, useEffect, useRef } from 'react'
import { Button, Input } from '@/components/ui'
import { FormField, SelectField } from '@/components/form'
import type {
    GetTransactionsParams,
    TransactionType,
} from '@/features/transactions/types/transaction.types'
import type { Account } from '@/features/accounts'
import type { SectionWithCategories } from '@/features/categories/types'

const ALL_FILTERS_VALUE = '__all__'
const SEARCH_DEBOUNCE_MS = 300

const getFilterValue = (value: unknown): string | null => {
    if (value === null || typeof value === 'string') return value

    throw new TypeError('Transaction filter values must be strings or null.')
}

const isTransactionType = (value: string): value is TransactionType =>
    value === 'INCOME' || value === 'EXPENSE' || value === 'TRANSFER' || value === 'ADJUSTMENT'

type TransactionFiltersProps = {
    accounts: Account[]
    sections: SectionWithCategories[]
    onChange: (filters: GetTransactionsParams) => void
}

export const TransactionFilters = ({ accounts, sections, onChange }: TransactionFiltersProps) => {
    const [type, setType] = useState<string | null>(null)
    const [accountId, setAccountId] = useState<string | null>(null)
    const [categoryId, setCategoryId] = useState<string | null>(null)
    const [search, setSearch] = useState<string>('')
    const [appliedSearch, setAppliedSearch] = useState('')
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (search === appliedSearch) return

        searchTimeoutRef.current = setTimeout(() => {
            searchTimeoutRef.current = null
            setAppliedSearch(search)
        }, SEARCH_DEBOUNCE_MS)

        return () => {
            if (searchTimeoutRef.current !== null) {
                clearTimeout(searchTimeoutRef.current)
                searchTimeoutRef.current = null
            }
        }
    }, [search, appliedSearch])

    useEffect(() => {
        const filters: GetTransactionsParams = {}
        if (type && isTransactionType(type)) filters.type = type
        if (accountId) filters.accountId = accountId
        if (categoryId) filters.categoryId = categoryId
        if (appliedSearch) filters.search = appliedSearch
        onChange(filters)
    }, [type, accountId, categoryId, appliedSearch, onChange])

    const clearFilters = () => {
        if (searchTimeoutRef.current !== null) {
            clearTimeout(searchTimeoutRef.current)
            searchTimeoutRef.current = null
        }
        setType(null)
        setAccountId(null)
        setCategoryId(null)
        setSearch('')
        setAppliedSearch('')
    }

    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <SelectField
                id="filter-type"
                label="Type"
                placeholder="All"
                value={type}
                onValueChange={(value) => {
                    const filterValue = getFilterValue(value)
                    setType(filterValue === ALL_FILTERS_VALUE ? null : filterValue)
                }}
                options={[
                    { value: ALL_FILTERS_VALUE, label: 'All' },
                    { value: 'INCOME', label: 'Income' },
                    { value: 'EXPENSE', label: 'Expense' },
                    { value: 'TRANSFER', label: 'Transfer' },
                    { value: 'ADJUSTMENT', label: 'Adjustment' },
                ]}
            />

            <SelectField
                id="filter-account"
                label="Account"
                placeholder="All accounts"
                value={accountId}
                onValueChange={(value) => {
                    const filterValue = getFilterValue(value)
                    setAccountId(filterValue === ALL_FILTERS_VALUE ? null : filterValue)
                }}
                options={[
                    { value: ALL_FILTERS_VALUE, label: 'All accounts' },
                    ...accounts.map((account) => ({ value: account.id, label: account.name })),
                ]}
            />

            <SelectField
                id="filter-category"
                label="Category"
                placeholder="All categories"
                value={categoryId}
                onValueChange={(value) => {
                    const filterValue = getFilterValue(value)
                    setCategoryId(filterValue === ALL_FILTERS_VALUE ? null : filterValue)
                }}
                options={[{ value: ALL_FILTERS_VALUE, label: 'All categories' }]}
                groups={sections.map((section) => ({
                    label: section.name,
                    options: section.categories.map((category) => ({
                        value: category.id,
                        label: category.name,
                    })),
                }))}
            />

            <FormField id="filter-search" label="Search">
                <div className="flex gap-2">
                    <Input
                        id="filter-search"
                        className="min-w-0 flex-1"
                        placeholder="merchant or note"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button type="button" className="shrink-0" onClick={clearFilters}>
                        Clear
                    </Button>
                </div>
            </FormField>
        </div>
    )
}

export default TransactionFilters
