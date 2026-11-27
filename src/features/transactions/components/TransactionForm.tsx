import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CurrencyInput, FormError, SelectField, TextField } from '@/components/form'
import { Button, SelectGroup, SelectGroupLabel, SelectItem } from '@/components/ui'
import {
    transactionFormSchema,
    type TransactionFormInput,
    type TransactionFormValues,
    defaultTransactionFormValues,
} from '@/features/transactions/schemas/transaction.schema'
import { MAX_MONEY_AMOUNT } from '@/shared/money'
import type { Account } from '@/features/accounts'
import type { SectionWithCategories } from '@/features/categories/types'

const NO_CATEGORY_VALUE = '__no_category__'

type TransactionFormProps = {
    accounts: Account[]
    sections: SectionWithCategories[]
    initialValues?: TransactionFormValues
    isPending?: boolean
    errorMessage?: string | null
    onSubmit: (values: TransactionFormValues) => Promise<void> | void
}

export const TransactionForm = ({
    accounts,
    sections,
    initialValues,
    isPending = false,
    errorMessage,
    onSubmit,
}: TransactionFormProps) => {
    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<TransactionFormInput, unknown, TransactionFormValues>({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: initialValues ?? defaultTransactionFormValues,
    })

    useEffect(() => reset(initialValues ?? defaultTransactionFormValues), [initialValues, reset])

    const type = useWatch({ control, name: 'type' })
    const selectedAccountId = useWatch({ control, name: 'accountId' })
    const selectedFromAccountId = useWatch({ control, name: 'fromAccountId' })
    const selectedToAccountId = useWatch({ control, name: 'toAccountId' })
    const selectedCategoryId = useWatch({ control, name: 'categoryId' })

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
        const normalized = { ...values }
        if (!normalized.categoryId) normalized.categoryId = null
        if (!normalized.merchant) normalized.merchant = null
        if (!normalized.note) normalized.note = null
        await onSubmit(normalized)
    }

    return (
        <form
            onSubmit={handleSubmit(async (values) => await submit(values))}
            noValidate
            className="space-y-4"
        >
            <Controller
                name="type"
                control={control}
                render={({ field, fieldState }) => (
                    <SelectField
                        id="type"
                        label="Type"
                        required
                        options={[
                            { value: 'INCOME', label: 'Income' },
                            { value: 'EXPENSE', label: 'Expense' },
                            { value: 'TRANSFER', label: 'Transfer' },
                            { value: 'ADJUSTMENT', label: 'Adjustment' },
                        ]}
                        value={field.value}
                        onValueChange={(value) => {
                            if (value) field.onChange(value)
                        }}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        error={fieldState.error?.message}
                        placeholder="Select transaction type"
                    />
                )}
            />

            <Controller
                name="amount"
                control={control}
                render={({ field, fieldState }) => (
                    <CurrencyInput
                        id="amount"
                        name={field.name}
                        ref={field.ref}
                        value={
                            field.value === null || field.value === undefined
                                ? null
                                : String(field.value)
                        }
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        label={type === 'ADJUSTMENT' ? 'Balance adjustment' : 'Amount'}
                        required
                        currency="CAD"
                        locale="fr-CA"
                        allowNegative={type === 'ADJUSTMENT'}
                        min={type === 'ADJUSTMENT' ? `-${MAX_MONEY_AMOUNT}` : undefined}
                        max={MAX_MONEY_AMOUNT}
                        error={fieldState.error?.message}
                    />
                )}
            />

            <TextField
                id="date"
                label="Date"
                type="date"
                required
                {...register('date' as const)}
                error={errors.date?.message}
            />

            {(type === 'INCOME' || type === 'EXPENSE' || type === 'ADJUSTMENT') && (
                <Controller
                    name="accountId"
                    control={control}
                    render={({ field, fieldState }) => (
                        <SelectField
                            id="accountId"
                            label="Account"
                            name={field.name}
                            required
                            options={accounts.map((account) => ({
                                value: account.id,
                                label: account.name,
                                disabled: account.isArchived && account.id !== selectedAccountId,
                            }))}
                            value={field.value ?? null}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            error={fieldState.error?.message}
                            placeholder="Select account"
                        />
                    )}
                />
            )}

            {type !== 'TRANSFER' && type !== 'ADJUSTMENT' && (
                <Controller
                    name="categoryId"
                    control={control}
                    render={({ field, fieldState }) => {
                        const selectedCategory = sections
                            .flatMap((section) => section.categories)
                            .find((category) => category.id === field.value)

                        return (
                            <SelectField
                                id="categoryId"
                                label="Category (optional)"
                                name={field.name}
                                value={field.value ?? null}
                                onValueChange={(value) =>
                                    field.onChange(value === NO_CATEGORY_VALUE ? null : value)
                                }
                                onBlur={field.onBlur}
                                ref={field.ref}
                                error={fieldState.error?.message}
                                placeholder="No category"
                                valueLabel={
                                    selectedCategory
                                        ? `${selectedCategory.name}${selectedCategory.isArchived ? ' (archived)' : ''}`
                                        : undefined
                                }
                            >
                                <SelectItem value={NO_CATEGORY_VALUE}>No category</SelectItem>
                                {sections.map((section) => (
                                    <SelectGroup key={section.id}>
                                        <SelectGroupLabel>
                                            {section.isArchived
                                                ? `${section.name} (archived)`
                                                : section.name}
                                        </SelectGroupLabel>
                                        {section.categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id}
                                                disabled={
                                                    category.isArchived &&
                                                    category.id !== (selectedCategoryId ?? '')
                                                }
                                            >
                                                {category.isArchived
                                                    ? `${category.name} (archived)`
                                                    : category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                ))}
                            </SelectField>
                        )
                    }}
                />
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
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Controller
                        name="fromAccountId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <SelectField
                                id="fromAccountId"
                                label="From account"
                                name={field.name}
                                required
                                options={accounts.map((account) => ({
                                    value: account.id,
                                    label: account.name,
                                    disabled:
                                        account.isArchived && account.id !== selectedFromAccountId,
                                }))}
                                value={field.value ?? null}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                ref={field.ref}
                                error={fieldState.error?.message}
                                placeholder="Select account"
                            />
                        )}
                    />
                    <Controller
                        name="toAccountId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <SelectField
                                id="toAccountId"
                                label="To account"
                                name={field.name}
                                required
                                options={accounts.map((account) => ({
                                    value: account.id,
                                    label: account.name,
                                    disabled:
                                        account.isArchived && account.id !== selectedToAccountId,
                                }))}
                                value={field.value ?? null}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                ref={field.ref}
                                error={fieldState.error?.message}
                                placeholder="Select account"
                            />
                        )}
                    />
                </div>
            )}

            <TextField
                id="note"
                label="Note (optional)"
                {...register('note' as const)}
                error={errors.note?.message}
            />

            <FormError message={errorMessage} />

            <Button
                type="submit"
                className="w-full"
                isLoading={isPending || isSubmitting}
                loadingText="Saving..."
            >
                Save
            </Button>
        </form>
    )
}

export default TransactionForm
