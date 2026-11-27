import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
    ColorPickerField,
    CurrencyInput,
    FormError,
    IconPickerField,
    SelectField,
    TextField,
} from '@/components/form'
import { Button } from '@/components/ui'
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

            <Controller
                name="type"
                control={control}
                render={({ field, fieldState }) => (
                    <SelectField
                        id="account-type"
                        label="Type"
                        required
                        options={accountTypeOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        error={fieldState.error?.message}
                    />
                )}
            />

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

            <Controller
                name="color"
                control={control}
                render={({ field, fieldState }) => (
                    <ColorPickerField
                        id="account-color"
                        label="Color"
                        required
                        value={field.value}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        disabled={isPending || isSubmitting}
                        error={fieldState.error?.message}
                    />
                )}
            />

            <Controller
                name="icon"
                control={control}
                render={({ field, fieldState }) => (
                    <IconPickerField
                        id="account-icon"
                        label="Icon"
                        required
                        value={field.value}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        disabled={isPending || isSubmitting}
                        error={fieldState.error?.message}
                    />
                )}
            />

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
