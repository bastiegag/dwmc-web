import { forwardRef } from 'react'
import type { ComponentRef } from 'react'
import { ColorPicker } from '@/components/ui'
import type { ColorPickerProps } from '@/components/ui'
import { Field, FieldDescription, FieldError, FieldLegend, Fieldset } from './Field'

export interface ColorPickerFieldProps extends Omit<
    ColorPickerProps,
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

export const ColorPickerField = forwardRef<ComponentRef<typeof ColorPicker>, ColorPickerFieldProps>(
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
                    <ColorPicker
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

ColorPickerField.displayName = 'ColorPickerField'
