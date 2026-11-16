import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormError } from '@/components/form/FormError'
import { CurrencyInput } from '@/components/form/CurrencyInput'
import {
    Button,
    Select,
    SelectContent,
    SelectGroup,
    SelectGroupLabel,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui'
import { TextField } from '@/components/form/TextField'
import { FormField } from '@/components/form/FormField'
import {
    transactionFormSchema,
    type TransactionFormInput,
    type TransactionFormValues,
    defaultTransactionFormValues,
} from '@/features/transactions/schemas/transaction.schema'
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
            <FormField id="type" label="Type" required error={errors.type?.message}>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                if (value) field.onChange(value)
                            }}
                        >
                            <SelectTrigger
                                id="type"
                                ref={field.ref}
                                onBlur={field.onBlur}
                                aria-invalid={Boolean(errors.type)}
                                aria-describedby={errors.type ? 'type-error' : undefined}
                            >
                                <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INCOME">Income</SelectItem>
                                <SelectItem value="EXPENSE">Expense</SelectItem>
                                <SelectItem value="TRANSFER">Transfer</SelectItem>
                                <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </FormField>

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
                <FormField
                    id="accountId"
                    label="Account"
                    required
                    error={errors.accountId?.message}
                >
                    <Controller
                        name="accountId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Select value={field.value ?? null} onValueChange={field.onChange}>
                                <SelectTrigger
                                    id="accountId"
                                    ref={field.ref}
                                    onBlur={field.onBlur}
                                    aria-invalid={Boolean(fieldState.error)}
                                    aria-describedby={
                                        fieldState.error ? 'accountId-error' : undefined
                                    }
                                >
                                    <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts.map((account) => (
                                        <SelectItem
                                            key={account.id}
                                            value={account.id}
                                            disabled={
                                                account.isArchived &&
                                                account.id !== selectedAccountId
                                            }
                                        >
                                            {account.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </FormField>
            )}

            {type !== 'TRANSFER' && type !== 'ADJUSTMENT' && (
                <FormField
                    id="categoryId"
                    label="Category (optional)"
                    error={errors.categoryId?.message}
                >
                    <Controller
                        name="categoryId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Select
                                value={field.value ?? null}
                                onValueChange={(value) =>
                                    field.onChange(value === NO_CATEGORY_VALUE ? null : value)
                                }
                            >
                                <SelectTrigger
                                    id="categoryId"
                                    ref={field.ref}
                                    onBlur={field.onBlur}
                                    aria-invalid={Boolean(fieldState.error)}
                                    aria-describedby={
                                        fieldState.error ? 'categoryId-error' : undefined
                                    }
                                >
                                    <SelectValue placeholder="No category" />
                                </SelectTrigger>
                                <SelectContent>
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
                                </SelectContent>
                            </Select>
                        )}
                    />
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
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <FormField
                        id="fromAccountId"
                        label="From account"
                        required
                        error={errors.fromAccountId?.message}
                    >
                        <Controller
                            name="fromAccountId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Select value={field.value ?? null} onValueChange={field.onChange}>
                                    <SelectTrigger
                                        id="fromAccountId"
                                        ref={field.ref}
                                        onBlur={field.onBlur}
                                        aria-invalid={Boolean(fieldState.error)}
                                        aria-describedby={
                                            fieldState.error ? 'fromAccountId-error' : undefined
                                        }
                                    >
                                        <SelectValue placeholder="Select account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts.map((account) => (
                                            <SelectItem
                                                key={account.id}
                                                value={account.id}
                                                disabled={
                                                    account.isArchived &&
                                                    account.id !== selectedFromAccountId
                                                }
                                            >
                                                {account.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </FormField>
                    <FormField
                        id="toAccountId"
                        label="To account"
                        required
                        error={errors.toAccountId?.message}
                    >
                        <Controller
                            name="toAccountId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Select value={field.value ?? null} onValueChange={field.onChange}>
                                    <SelectTrigger
                                        id="toAccountId"
                                        ref={field.ref}
                                        onBlur={field.onBlur}
                                        aria-invalid={Boolean(fieldState.error)}
                                        aria-describedby={
                                            fieldState.error ? 'toAccountId-error' : undefined
                                        }
                                    >
                                        <SelectValue placeholder="Select account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts.map((account) => (
                                            <SelectItem
                                                key={account.id}
                                                value={account.id}
                                                disabled={
                                                    account.isArchived &&
                                                    account.id !== selectedToAccountId
                                                }
                                            >
                                                {account.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
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
