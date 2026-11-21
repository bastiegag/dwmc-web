import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { FormError } from '@/components/form/FormError'
import { Button, ColorPicker } from '@/components/ui'
import { FormField } from '@/components/form/FormField'
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

                <FormField
                    id="section-color"
                    label="Color"
                    required
                    error={errors.color?.message}
                    disabled={isBusy}
                >
                    <Controller
                        name="color"
                        control={control}
                        render={({ field, fieldState }) => (
                            <ColorPicker
                                id="section-color"
                                ref={field.ref}
                                value={field.value}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                aria-labelledby="section-color-label"
                                required
                                disabled={isBusy}
                                invalid={Boolean(fieldState.error)}
                                aria-describedby={
                                    fieldState.error ? 'section-color-error' : undefined
                                }
                            />
                        )}
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
