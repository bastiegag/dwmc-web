import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { CurrencyInput } from '@/components/form/CurrencyInput'
import { FormError } from '@/components/form/FormError'
import { SelectField } from '@/components/form/SelectField'
import { TextField } from '@/components/form/TextField'
import { Button, SelectGroup, SelectGroupLabel, SelectItem } from '@/components/ui'
import { MAX_MONEY_AMOUNT } from '@/shared/money'
import {
    budgetFormSchema,
    type BudgetFormInput,
    type BudgetFormValues,
} from '@/features/budgets/schemas/budget.schema'
import type { SectionWithCategories } from '@/features/categories/types'

type Props = {
    sections: SectionWithCategories[]
    initialValues?: BudgetFormInput
    submitLabel: string
    isPending?: boolean
    isCategoriesLoading?: boolean
    errorMessage?: string | null
    onSubmit: (values: BudgetFormValues) => Promise<void> | void
}

const defaultValues: BudgetFormInput = { categoryId: '', month: '', amount: '0' }

export const BudgetForm = ({
    sections,
    initialValues,
    submitLabel,
    isPending = false,
    isCategoriesLoading = false,
    errorMessage,
    onSubmit,
}: Props) => {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<BudgetFormInput, unknown, BudgetFormValues>({
        resolver: zodResolver(budgetFormSchema),
        mode: 'onBlur',
        defaultValues: initialValues ?? defaultValues,
    })

    useEffect(() => {
        reset(initialValues ?? defaultValues)
    }, [initialValues, reset])

    const selectableCategories = sections.flatMap((section) =>
        section.categories.filter(
            (category) => !category.isArchived || category.id === initialValues?.categoryId,
        ),
    )
    const isDisabled = isPending || isSubmitting
    const isCategoryDisabled = isDisabled || selectableCategories.length === 0

    return (
        <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => await onSubmit(values))}
            noValidate
        >
            <fieldset disabled={isDisabled} className="min-w-0 space-y-4 border-0 p-0">
                <Controller
                    name="categoryId"
                    control={control}
                    render={({ field, fieldState }) => {
                        const selectedCategory = sections
                            .flatMap((section) => section.categories)
                            .find((category) => category.id === field.value)

                        return (
                            <SelectField
                                id="budget-category"
                                label="Category"
                                name={field.name}
                                required
                                value={field.value || null}
                                onValueChange={(value) => field.onChange(value ?? '')}
                                onBlur={field.onBlur}
                                ref={field.ref}
                                disabled={isCategoryDisabled}
                                error={fieldState.error?.message}
                                description={
                                    isCategoriesLoading
                                        ? 'Loading categories...'
                                        : selectableCategories.length === 0
                                          ? 'No categories are available. Create a category before adding a budget.'
                                          : undefined
                                }
                                placeholder="Select a category"
                                valueLabel={
                                    selectedCategory
                                        ? `${selectedCategory.name}${selectedCategory.isArchived ? ' (archived)' : ''}`
                                        : undefined
                                }
                            >
                                {sections.map((section) =>
                                    section.categories.length > 0 ? (
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
                                                        category.id !==
                                                            (initialValues?.categoryId ?? '')
                                                    }
                                                >
                                                    {category.isArchived
                                                        ? `${category.name} (archived)`
                                                        : category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    ) : null,
                                )}
                            </SelectField>
                        )
                    }}
                />

                <TextField
                    id="budget-month"
                    label="Month"
                    type="month"
                    required
                    {...register('month')}
                    error={errors.month?.message}
                />

                <Controller
                    name="amount"
                    control={control}
                    render={({ field, fieldState }) => (
                        <CurrencyInput
                            id="budget-amount"
                            name={field.name}
                            ref={field.ref}
                            value={field.value ?? null}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            label="Amount"
                            required
                            currency="CAD"
                            locale="fr-CA"
                            min="0"
                            max={MAX_MONEY_AMOUNT}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    isLoading={isDisabled}
                    loadingText="Saving..."
                >
                    {submitLabel}
                </Button>
            </fieldset>

            <FormError message={errorMessage} />
        </form>
    )
}

export default BudgetForm
