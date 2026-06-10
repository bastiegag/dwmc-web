import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormError } from '@/components/form/FormError'
import { FormSubmitButton } from '@/components/form/FormSubmitButton'
import { TextField } from '@/components/form/TextField'
import { Label } from '@/components/ui/label'
import { FormField } from '@/components/form/FormField'
import {
    transactionFormSchema,
    type TransactionFormValues,
    defaultTransactionFormValues,
} from '@/features/transactions/schemas/transaction.schema'
import type { Account } from '@/features/accounts/types/account.types'
import type { SectionWithCategories } from '@/features/categories/types'

type TransactionFormProps = {
    accounts: Account[]
    sections: SectionWithCategories[]
    initialValues?: TransactionFormValues
    isPending?: boolean
    errorMessage?: string | null
    onSubmit: (values: TransactionFormValues) => Promise<void> | void
}

export function TransactionForm({
    accounts,
    sections,
    initialValues,
    isPending = false,
    errorMessage,
    onSubmit,
}: TransactionFormProps) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: initialValues ?? defaultTransactionFormValues,
    })

    useEffect(() => reset(initialValues ?? defaultTransactionFormValues), [initialValues, reset])

    const type = useWatch({ control, name: 'type' })

    useEffect(() => {
        if (type === 'TRANSFER') {
            setValue('accountId', null)
            setValue('categoryId', null)
            setValue('merchant', null)
        } else if (type === 'ADJUSTMENT') {
            setValue('categoryId', null)
            setValue('merchant', null)
            setValue('fromAccountId', null)
            setValue('toAccountId', null)
        } else {
            setValue('fromAccountId', null)
            setValue('toAccountId', null)
        }
    }, [type, setValue])

    const submit = async (values: TransactionFormValues) => {
        const normalized = { ...values } as TransactionFormValues
        if (!normalized.categoryId) normalized.categoryId = null
        if (!normalized.merchant) normalized.merchant = null
        if (!normalized.note) normalized.note = null
        await onSubmit(normalized)
    }

    return (
        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
            <div>
                <Label htmlFor="type">Type</Label>
                <select id="type" {...register('type')} className="w-full">
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                    <option value="TRANSFER">Transfer</option>
                    <option value="ADJUSTMENT">Adjustment</option>
                </select>
            </div>

            <TextField
                id="amount"
                label="Amount"
                type="number"
                step="0.01"
                {...register('amount' as const)}
                error={errors.amount?.message}
            />

            <TextField
                id="date"
                label="Date"
                type="date"
                {...register('date' as const)}
                error={errors.date?.message}
            />

            {(type === 'INCOME' || type === 'EXPENSE' || type === 'ADJUSTMENT') && (
                <FormField id="accountId" label="Account" error={errors.accountId?.message}>
                    <select id="accountId" {...register('accountId' as const)} className="w-full">
                        <option value="">Select account</option>
                        {accounts.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.name}
                            </option>
                        ))}
                    </select>
                </FormField>
            )}

            {type !== 'TRANSFER' && type !== 'ADJUSTMENT' && (
                <FormField
                    id="categoryId"
                    label="Category (optional)"
                    error={errors.categoryId?.message}
                >
                    <select id="categoryId" {...register('categoryId' as const)} className="w-full">
                        <option value="">No category</option>
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
                </FormField>
            )}

            {(type === 'INCOME' || type === 'EXPENSE') && (
                <TextField
                    id="merchant"
                    label="Merchant (optional)"
                    {...register('merchant' as const)}
                    error={errors.merchant?.message}
                />
            )}

            {type === 'TRANSFER' && (
                <div className="grid grid-cols-2 gap-2">
                    <FormField
                        id="fromAccountId"
                        label="From account"
                        error={errors.fromAccountId?.message}
                    >
                        <select
                            id="fromAccountId"
                            {...register('fromAccountId' as const)}
                            className="w-full"
                        >
                            <option value="">Select account</option>
                            {accounts.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </FormField>
                    <FormField
                        id="toAccountId"
                        label="To account"
                        error={errors.toAccountId?.message}
                    >
                        <select
                            id="toAccountId"
                            {...register('toAccountId' as const)}
                            className="w-full"
                        >
                            <option value="">Select account</option>
                            {accounts.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>
            )}

            <TextField
                id="note"
                label="Note (optional)"
                {...register('note' as const)}
                error={errors.note?.message}
            />

            <FormError message={errorMessage} />

            <FormSubmitButton isLoading={isPending} loadingText="Saving...">
                Save
            </FormSubmitButton>
        </form>
    )
}

export default TransactionForm
