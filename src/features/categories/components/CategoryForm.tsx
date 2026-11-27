import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { IconPickerField, FormError, SelectField, TextField } from '@/components/form'
import { Button, SelectItem } from '@/components/ui'
import {
    categoryFormSchema,
    type CategoryFormSubmitValues,
    type CategoryFormValues,
} from '@/features/categories/schemas'
import type { SectionWithCategories } from '@/features/categories/types'

type CategoryFormProps = {
    sections: SectionWithCategories[]
    initialValues?: CategoryFormValues
    submitLabel: string
    isPending?: boolean
    errorMessage?: string | null
    onSubmit: (values: CategoryFormSubmitValues) => Promise<void> | void
}

const defaultValues: CategoryFormValues = {
    name: '',
    icon: 'shopping-cart',
    sectionId: '',
}

export const CategoryForm = ({
    sections,
    initialValues,
    submitLabel,
    isPending = false,
    errorMessage,
    onSubmit,
}: CategoryFormProps) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        mode: 'onBlur',
        defaultValues: initialValues ?? defaultValues,
    })

    useEffect(() => {
        reset(initialValues ?? defaultValues)
    }, [initialValues, reset])

    const isBusy = isPending || isSubmitting
    const selectableSections = sections.filter(
        (section) => !section.isArchived || section.id === initialValues?.sectionId,
    )

    const submit = async (values: CategoryFormValues) => {
        const currentSection = sections.find((section) => section.id === initialValues?.sectionId)
        if (currentSection?.isArchived && values.sectionId === initialValues?.sectionId) {
            await onSubmit({ name: values.name, icon: values.icon })
            return
        }

        await onSubmit(values)
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit(submit)} noValidate>
            <fieldset disabled={isBusy} className="min-w-0 space-y-4 border-0 p-0">
                <TextField
                    id="category-name"
                    label="Category name"
                    placeholder="Groceries"
                    required
                    maxLength={80}
                    {...register('name')}
                    error={errors.name?.message}
                />

                <Controller
                    name="icon"
                    control={control}
                    render={({ field, fieldState }) => (
                        <IconPickerField
                            id="category-icon"
                            label="Icon"
                            required
                            value={field.value}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            disabled={isBusy}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <Controller
                    name="sectionId"
                    control={control}
                    render={({ field, fieldState }) => {
                        const selectedSection = sections.find(
                            (section) => section.id === field.value,
                        )

                        return (
                            <SelectField
                                id="category-section"
                                label="Section"
                                name={field.name}
                                required
                                value={field.value || null}
                                onValueChange={(value) => field.onChange(value ?? '')}
                                onBlur={field.onBlur}
                                ref={field.ref}
                                disabled={isBusy || selectableSections.length === 0}
                                error={fieldState.error?.message}
                                description={
                                    selectableSections.length === 0
                                        ? 'No active sections are available. Create a section before adding a category.'
                                        : undefined
                                }
                                placeholder="Select a section"
                                valueLabel={
                                    selectedSection
                                        ? `${selectedSection.name}${selectedSection.isArchived ? ' (archived)' : ''}`
                                        : undefined
                                }
                            >
                                {sections.map((section) => (
                                    <SelectItem
                                        key={section.id}
                                        value={section.id}
                                        disabled={
                                            section.isArchived &&
                                            section.id !== initialValues?.sectionId
                                        }
                                    >
                                        {section.name}
                                        {section.isArchived ? ' (archived)' : ''}
                                    </SelectItem>
                                ))}
                            </SelectField>
                        )
                    }}
                />

                <Button type="submit" className="w-full" isLoading={isBusy} loadingText="Saving...">
                    {submitLabel}
                </Button>
            </fieldset>

            <FormError message={errorMessage} />
        </form>
    )
}
