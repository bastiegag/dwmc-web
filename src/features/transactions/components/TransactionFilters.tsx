import { useState, useEffect, useRef } from 'react'
import {
    Button,
    Input,
    Select,
    SelectContent,
    SelectGroup,
    SelectGroupLabel,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui'
import { FormField } from '@/components/form/FormField'
import type {
    GetTransactionsParams,
    TransactionType,
} from '@/features/transactions/types/transaction.types'
import type { Account } from '@/features/accounts'
import type { SectionWithCategories } from '@/features/categories/types'

const ALL_FILTERS_VALUE = '__all__'
const SEARCH_DEBOUNCE_MS = 300

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
            <FormField id="filter-type" label="Type">
                <Select
                    value={type}
                    onValueChange={(value) => setType(value === ALL_FILTERS_VALUE ? null : value)}
                >
                    <SelectTrigger id="filter-type">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL_FILTERS_VALUE}>All</SelectItem>
                        <SelectItem value="INCOME">Income</SelectItem>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                        <SelectItem value="TRANSFER">Transfer</SelectItem>
                        <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>

            <FormField id="filter-account" label="Account">
                <Select
                    value={accountId}
                    onValueChange={(value) =>
                        setAccountId(value === ALL_FILTERS_VALUE ? null : value)
                    }
                >
                    <SelectTrigger id="filter-account">
                        <SelectValue placeholder="All accounts" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL_FILTERS_VALUE}>All accounts</SelectItem>
                        {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                                {account.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>

            <FormField id="filter-category" label="Category">
                <Select
                    value={categoryId}
                    onValueChange={(value) =>
                        setCategoryId(value === ALL_FILTERS_VALUE ? null : value)
                    }
                >
                    <SelectTrigger id="filter-category">
                        <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL_FILTERS_VALUE}>All categories</SelectItem>
                        {sections.map((section) => (
                            <SelectGroup key={section.id}>
                                <SelectGroupLabel>{section.name}</SelectGroupLabel>
                                {section.categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>

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
