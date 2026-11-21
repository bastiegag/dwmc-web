import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { FormError } from '@/components/form/FormError'
import { CurrencyInput } from '@/components/form/CurrencyInput'
import { FormField } from '@/components/form/FormField'
import {
    Button,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    ColorPicker,
    IconPicker,
} from '@/components/ui'
import { TextField } from '@/components/form/TextField'
import { MAX_MONEY_AMOUNT } from '@/shared/money'
import {
    accountFormSchema,
    type AccountFormInput,
    type AccountFormValues,
} from '@/features/accounts/schemas/account.schema'
import type { AccountType } from '@/features/accounts/types/account.types'

type AccountFormProps = {
    initialValues?: AccountFormValues
    submitLabel: string
    isPending?: boolean
    errorMessage?: string | null
    onSubmit: (values: AccountFormValues) => Promise<void> | void
}

const defaultValues: AccountFormValues = {
    name: '',
    type: 'CHECKING',
    startingBalance: 0,
    goal: null,
    color: 'primary',
    icon: 'wallet',
}

const accountTypeOptions: { value: AccountType; label: string }[] = [
    { value: 'CHECKING', label: 'Checking' },
    { value: 'SAVINGS', label: 'Savings' },
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'CASH', label: 'Cash' },
    { value: 'INVESTMENT', label: 'Investment' },
    { value: 'LOAN', label: 'Loan' },
    { value: 'OTHER', label: 'Other' },
]

export const AccountForm = ({
    initialValues,
    submitLabel,
    isPending = false,
    errorMessage,
    onSubmit,
}: AccountFormProps) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AccountFormInput, unknown, AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        mode: 'onBlur',
        defaultValues: initialValues ?? defaultValues,
    })

    const accountType = useWatch({ control, name: 'type' })

    useEffect(() => {
        reset(initialValues ?? defaultValues)
    }, [initialValues, reset])

    useEffect(() => {
        if (accountType !== 'SAVINGS') setValue('goal', null)
    }, [accountType, setValue])

    return (
        <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => await onSubmit(values))}
            noValidate
        >
            <TextField
                id="account-name"
                label="Account name"
                placeholder="Checking"
                required
                {...register('name')}
                error={errors.name?.message}
            />

            <FormField id="account-type" label="Type" required error={errors.type?.message}>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange} required>
                            <SelectTrigger
                                id="account-type"
                                ref={field.ref}
                                onBlur={field.onBlur}
                                aria-invalid={Boolean(errors.type)}
                                aria-describedby={errors.type ? 'account-type-error' : undefined}
                            >
                                <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                                {accountTypeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </FormField>

            <Controller
                name="startingBalance"
                control={control}
                render={({ field, fieldState }) => (
                    <CurrencyInput
                        id="starting-balance"
                        name={field.name}
                        ref={field.ref}
                        value={field.value === null ? null : String(field.value)}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        label="Starting balance (at setup, optional)"
                        currency="CAD"
                        locale="fr-CA"
                        allowNegative
                        min={`-${MAX_MONEY_AMOUNT}`}
                        max={MAX_MONEY_AMOUNT}
                        error={fieldState.error?.message}
                    />
                )}
            />

            {accountType === 'SAVINGS' ? (
                <Controller
                    name="goal"
                    control={control}
                    render={({ field, fieldState }) => (
                        <CurrencyInput
                            id="goal"
                            name={field.name}
                            ref={field.ref}
                            value={
                                field.value === null || field.value === undefined
                                    ? null
                                    : String(field.value)
                            }
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            label="Savings goal (optional)"
                            currency="CAD"
                            locale="fr-CA"
                            min="0.01"
                            max={MAX_MONEY_AMOUNT}
                            error={fieldState.error?.message}
                        />
                    )}
                />
            ) : null}

            <p className="text-sm text-muted-foreground">
                Use a balance adjustment transaction later when you need to reconcile this account
                with reality.
            </p>

            <FormField id="account-color" label="Color" required error={errors.color?.message}>
                <Controller
                    name="color"
                    control={control}
                    render={({ field, fieldState }) => (
                        <ColorPicker
                            id="account-color"
                            ref={field.ref}
                            value={field.value}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            aria-labelledby="account-color-label"
                            required
                            disabled={isPending || isSubmitting}
                            invalid={Boolean(fieldState.error)}
                            aria-describedby={fieldState.error ? 'account-color-error' : undefined}
                        />
                    )}
                />
            </FormField>

            <FormField id="account-icon" label="Icon" required error={errors.icon?.message}>
                <Controller
                    name="icon"
                    control={control}
                    render={({ field, fieldState }) => (
                        <IconPicker
                            id="account-icon"
                            ref={field.ref}
                            value={field.value}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            aria-labelledby="account-icon-label"
                            required
                            disabled={isPending || isSubmitting}
                            invalid={Boolean(fieldState.error)}
                            aria-describedby={fieldState.error ? 'account-icon-error' : undefined}
                        />
                    )}
                />
            </FormField>

            <FormError message={errorMessage} />

            <Button
                type="submit"
                className="w-full"
                isLoading={isPending || isSubmitting}
                loadingText="Saving..."
            >
                {submitLabel}
            </Button>
        </form>
    )
}

export default AccountForm
