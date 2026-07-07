import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FormError } from '@/components/form/FormError'
import { FormSubmitButton } from '@/components/form/FormSubmitButton'
import { TextField } from '@/components/form/TextField'
import { categoryFormSchema, type CategoryFormValues } from '@/features/categories/schemas'
import type { SectionWithCategories } from '@/features/categories/types'
import { Label } from '@/components/ui/label'

type CategoryFormProps = {
    sections: SectionWithCategories[]
    initialValues?: CategoryFormValues
    submitLabel: string
    isPending?: boolean
    errorMessage?: string | null
    onSubmit: (values: CategoryFormValues) => Promise<void> | void
}

const defaultValues: CategoryFormValues = {
    name: '',
    icon: '',
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
        formState: { errors },
        reset,
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        mode: 'onBlur',
        defaultValues: initialValues ?? defaultValues,
    })

    useEffect(() => {
        reset(initialValues ?? defaultValues)
    }, [initialValues, reset])

    return (
        <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
                await onSubmit(values)
            })}
            noValidate
        >
            <TextField
                id="category-name"
                label="Category name"
                placeholder="Groceries"
                {...register('name')}
                error={errors.name?.message}
            />

            <TextField
                id="category-icon"
                label="Icon"
                placeholder="shopping-cart"
                {...register('icon')}
                error={errors.icon?.message}
            />

            <div className="space-y-2">
                <Label htmlFor="category-section">Section</Label>
                <select
                    id="category-section"
                    className="border-input bg-transparent placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm"
                    aria-invalid={errors.sectionId ? 'true' : 'false'}
                    aria-describedby={errors.sectionId ? 'category-section-error' : undefined}
                    {...register('sectionId')}
                >
                    <option value="">Select a section</option>
                    {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                            {section.name}
                        </option>
                    ))}
                </select>
                {errors.sectionId ? (
                    <p
                        id="category-section-error"
                        className="text-sm text-destructive"
                        role="alert"
                    >
                        {errors.sectionId.message}
                    </p>
                ) : null}
            </div>

            <FormError message={errorMessage} />

            <FormSubmitButton isLoading={isPending} loadingText="Saving...">
                {submitLabel}
            </FormSubmitButton>
        </form>
    )
}
