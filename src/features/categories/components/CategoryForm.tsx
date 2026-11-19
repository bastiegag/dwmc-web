import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { FormError } from '@/components/form/FormError'
import { FormField } from '@/components/form/FormField'
import {
    Button,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    IconPicker,
} from '@/components/ui'
import { TextField } from '@/components/form/TextField'
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

                <FormField
                    id="category-icon"
                    label="Icon"
                    required
                    error={errors.icon?.message}
                    disabled={isBusy}
                >
                    <Controller
                        name="icon"
                        control={control}
                        render={({ field, fieldState }) => (
                            <IconPicker
                                id="category-icon"
                                ref={field.ref}
                                value={field.value}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                aria-labelledby="category-icon-label"
                                required
                                disabled={isBusy}
                                invalid={Boolean(fieldState.error)}
                                aria-describedby={
                                    fieldState.error ? 'category-icon-error' : undefined
                                }
                            />
                        )}
                    />
                </FormField>

                <FormField
                    id="category-section"
                    label="Section"
                    required
                    error={errors.sectionId?.message}
                    description={
                        selectableSections.length === 0
                            ? 'No active sections are available. Create a section before adding a category.'
                            : undefined
                    }
                    disabled={isBusy || selectableSections.length === 0}
                >
                    <Controller
                        name="sectionId"
                        control={control}
                        render={({ field }) => {
                            const selectedSection = sections.find(
                                (section) => section.id === field.value,
                            )

                            return (
                                <Select
                                    name={field.name}
                                    value={field.value || null}
                                    required
                                    disabled={isBusy || selectableSections.length === 0}
                                    onValueChange={(value) => field.onChange(value ?? '')}
                                >
                                    <SelectTrigger
                                        id="category-section"
                                        ref={field.ref}
                                        onBlur={field.onBlur}
                                        aria-required="true"
                                        aria-invalid={Boolean(errors.sectionId)}
                                        aria-describedby={
                                            errors.sectionId ? 'category-section-error' : undefined
                                        }
                                    >
                                        <SelectValue placeholder="Select a section">
                                            {selectedSection
                                                ? `${selectedSection.name}${selectedSection.isArchived ? ' (archived)' : ''}`
                                                : undefined}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
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
                                    </SelectContent>
                                </Select>
                            )
                        }}
                    />
                </FormField>

                <Button type="submit" className="w-full" isLoading={isBusy} loadingText="Saving...">
                    {submitLabel}
                </Button>
            </fieldset>

            <FormError message={errorMessage} />
        </form>
    )
}
