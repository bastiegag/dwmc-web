import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FormError } from '@/components/form/FormError'
import { FormSubmitButton } from '@/components/form/FormSubmitButton'
import { budgetFormSchema, type BudgetFormValues } from '@/features/budgets/schemas/budget.schema'
import type { SectionWithCategories } from '@/features/categories/types'

type Props = {
    sections: SectionWithCategories[]
    initialValues?: BudgetFormValues
    submitLabel: string
    isPending?: boolean
    errorMessage?: string | null
    onSubmit: (values: BudgetFormValues) => Promise<void> | void
}

const defaultValues: BudgetFormValues = { categoryId: '', month: '', amount: 0 }

export function BudgetForm({
    sections,
    initialValues,
    submitLabel,
    isPending = false,
    errorMessage,
    onSubmit,
}: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetFormSchema) as unknown as Resolver<BudgetFormValues>,
        mode: 'onBlur',
        defaultValues: initialValues ?? defaultValues,
    })

    useEffect(() => {
        reset(initialValues ?? defaultValues)
    }, [initialValues, reset])

    return (
        <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => await onSubmit(values))}
            noValidate
        >
            <div className="space-y-2">
                <Label htmlFor="budget-category">Category</Label>
                <select
                    id="budget-category"
                    className="border-input bg-transparent focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-base"
                    aria-invalid={errors.categoryId ? 'true' : 'false'}
                    {...register('categoryId')}
                >
                    <option value="">Select a category</option>
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
                {errors.categoryId ? (
                    <p className="text-sm text-destructive" role="alert">
                        {errors.categoryId.message}
                    </p>
                ) : null}
            </div>

            <div className="space-y-2">
                <Label htmlFor="budget-month">Month</Label>
                <Input
                    id="budget-month"
                    type="month"
                    {...register('month')}
                    aria-invalid={errors.month ? 'true' : 'false'}
                />
                {errors.month ? (
                    <p className="text-sm text-destructive" role="alert">
                        {errors.month.message}
                    </p>
                ) : null}
            </div>

            <div className="space-y-2">
                <Label htmlFor="budget-amount">Amount</Label>
                <Input
                    id="budget-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('amount')}
                    aria-invalid={errors.amount ? 'true' : 'false'}
                />
                {errors.amount ? (
                    <p className="text-sm text-destructive" role="alert">
                        {errors.amount.message}
                    </p>
                ) : null}
            </div>

            <FormError message={errorMessage} />

            <div className="flex justify-end">
                <FormSubmitButton isLoading={isPending}>{submitLabel}</FormSubmitButton>
            </div>
        </form>
    )
}

export default BudgetForm
