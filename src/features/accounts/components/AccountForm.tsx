import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FormError } from '@/components/form/FormError'
import { FormSubmitButton } from '@/components/form/FormSubmitButton'
import { TextField } from '@/components/form/TextField'
import { Label } from '@/components/ui/label'
import {
    accountFormSchema,
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
    color: '#3b82f6',
    icon: 'wallet',
}

export function AccountForm({
    initialValues,
    submitLabel,
    isPending = false,
    errorMessage,
    onSubmit,
}: AccountFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        mode: 'onBlur',
        defaultValues: initialValues ?? defaultValues,
    })

    useEffect(() => {
        reset(initialValues ?? defaultValues)
    }, [initialValues, reset])

    const accountTypeOptions: { value: AccountType; label: string }[] = [
        { value: 'CHECKING', label: 'Checking' },
        { value: 'SAVINGS', label: 'Savings' },
        { value: 'CREDIT_CARD', label: 'Credit Card' },
        { value: 'CASH', label: 'Cash' },
        { value: 'INVESTMENT', label: 'Investment' },
        { value: 'LOAN', label: 'Loan' },
        { value: 'OTHER', label: 'Other' },
    ]

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
                {...register('name')}
                error={errors.name?.message}
            />

            <div className="space-y-2">
                <Label htmlFor="account-type">Type</Label>
                <select
                    id="account-type"
                    className="border-input bg-transparent flex h-9 w-full rounded-md border px-3 py-1 text-base"
                    {...register('type')}
                >
                    {accountTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <TextField
                id="starting-balance"
                label="Starting balance"
                type="number"
                step="0.01"
                {...register('startingBalance' as const)}
                error={errors.startingBalance?.message}
            />

            <TextField
                id="goal"
                label="Goal (optional)"
                type="number"
                step="0.01"
                {...register('goal' as const)}
                error={errors.goal?.message}
            />

            <TextField
                id="color"
                label="Color"
                type="color"
                {...register('color' as const)}
                error={errors.color?.message}
            />

            <TextField
                id="icon"
                label="Icon"
                placeholder="wallet"
                {...register('icon' as const)}
                error={errors.icon?.message}
            />

            <FormError message={errorMessage} />

            <FormSubmitButton isLoading={isPending} loadingText="Saving...">
                {submitLabel}
            </FormSubmitButton>
        </form>
    )
}

export default AccountForm
