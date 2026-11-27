import { forwardRef } from 'react'
import type { ComponentRef } from 'react'
import { IconPicker } from '@/components/ui'
import type { IconPickerProps } from '@/components/ui'
import { Field, FieldDescription, FieldError, FieldLegend, Fieldset } from './Field'

export interface IconPickerFieldProps extends Omit<
    IconPickerProps,
    'id' | 'required' | 'disabled' | 'invalid' | 'aria-labelledby' | 'aria-describedby'
> {
    id: string
    label: string
    description?: string
    error?: string
    required?: boolean
    disabled?: boolean
    className?: string
    fieldClassName?: string
    'aria-describedby'?: string
}

export const IconPickerField = forwardRef<ComponentRef<typeof IconPicker>, IconPickerFieldProps>(
    (
        {
            id,
            label,
            description,
            error,
            required,
            disabled,
            className,
            fieldClassName,
            'aria-describedby': ariaDescribedBy,
            ...pickerProps
        },
        ref,
    ) => {
        const describedBy =
            [ariaDescribedBy, description && `${id}-description`, error && `${id}-error`]
                .filter(Boolean)
                .join(' ') || undefined

        return (
            <Field invalid={Boolean(error)} disabled={disabled} className={fieldClassName}>
                <Fieldset disabled={disabled} className={className}>
                    <FieldLegend id={`${id}-legend`}>
                        {label}
                        {required && (
                            <span className="ml-1 text-destructive-border" aria-hidden="true">
                                *
                            </span>
                        )}
                    </FieldLegend>
                    <IconPicker
                        {...pickerProps}
                        ref={ref}
                        id={id}
                        required={required}
                        disabled={disabled}
                        invalid={Boolean(error)}
                        aria-labelledby={`${id}-legend`}
                        aria-describedby={describedBy}
                    />
                    {description && (
                        <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
                    )}
                    <FieldError id={`${id}-error`}>{error}</FieldError>
                </Fieldset>
            </Field>
        )
    },
)

IconPickerField.displayName = 'IconPickerField'
