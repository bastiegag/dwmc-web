import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { ColorPickerField, FormError, TextField } from '@/components/form'
import { Button } from '@/components/ui'
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
    color: 'success',
}

export const SectionForm = ({
    initialValues,
    submitLabel,
    isPending = false,
    errorMessage,
    onSubmit,
}: SectionFormProps) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<SectionFormValues>({
        resolver: zodResolver(sectionFormSchema),
        mode: 'onBlur',
        defaultValues: initialValues ?? defaultValues,
    })

    useEffect(() => {
        reset(initialValues ?? defaultValues)
    }, [initialValues, reset])

    const isBusy = isPending || isSubmitting

    return (
        <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
                await onSubmit(values)
            })}
            noValidate
        >
            <fieldset disabled={isBusy} className="min-w-0 space-y-4 border-0 p-0">
                <TextField
                    id="section-name"
                    label="Section name"
                    placeholder="Food"
                    required
                    maxLength={80}
                    {...register('name')}
                    error={errors.name?.message}
                />

                <Controller
                    name="color"
                    control={control}
                    render={({ field, fieldState }) => (
                        <ColorPickerField
                            id="section-color"
                            label="Color"
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

                <Button type="submit" className="w-full" isLoading={isBusy} loadingText="Saving...">
                    {submitLabel}
                </Button>
            </fieldset>

            <FormError message={errorMessage} />
        </form>
    )
}
