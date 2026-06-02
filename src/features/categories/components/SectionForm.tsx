import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FormError } from '@/components/form/FormError'
import { FormSubmitButton } from '@/components/form/FormSubmitButton'
import { TextField } from '@/components/form/TextField'
import { sectionFormSchema, type SectionFormValues } from '@/features/categories/schemas'

type SectionFormProps = {
    initialValues?: SectionFormValues
    submitLabel: string
    isPending?: boolean
    errorMessage?: string | null
    onSubmit: (values: SectionFormValues) => Promise<void> | void
}

const defaultValues: SectionFormValues = {
    name: '',
    color: '#22c55e',
}

export function SectionForm({
    initialValues,
    submitLabel,
    isPending = false,
    errorMessage,
    onSubmit,
}: SectionFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SectionFormValues>({
        resolver: zodResolver(sectionFormSchema),
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
                id="section-name"
                label="Section name"
                placeholder="Food"
                {...register('name')}
                error={errors.name?.message}
            />

            <TextField
                id="section-color"
                label="Color"
                type="color"
                {...register('color')}
                error={errors.color?.message}
            />

            <FormError message={errorMessage} />

            <FormSubmitButton isLoading={isPending} loadingText="Saving...">
                {submitLabel}
            </FormSubmitButton>
        </form>
    )
}
