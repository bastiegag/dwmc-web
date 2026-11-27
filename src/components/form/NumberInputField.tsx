import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ComponentRef } from 'react'
import {
    NumberField,
    NumberFieldDecrement,
    NumberFieldGroup,
    NumberFieldIncrement,
    NumberFieldInput,
} from '@/components/ui'
import { FormField } from './FormField'
import { getFieldDescribedBy } from './fieldUtils'

export interface NumberInputFieldProps extends Omit<
    ComponentPropsWithoutRef<typeof NumberField>,
    'children'
> {
    id: string
    label: string
    description?: string
    error?: string
    required?: boolean
    readOnly?: boolean
    className?: string
    inputClassName?: string
    fieldClassName?: string
    'aria-describedby'?: string
}

export const NumberInputField = forwardRef<
    ComponentRef<typeof NumberFieldInput>,
    NumberInputFieldProps
>(
    (
        {
            id,
            label,
            description,
            error,
            required,
            disabled,
            readOnly,
            className,
            inputClassName,
            fieldClassName,
            'aria-describedby': ariaDescribedBy,
            ...numberFieldProps
        },
        ref,
    ) => (
        <FormField
            id={id}
            label={label}
            description={description}
            error={error}
            required={required}
            disabled={disabled}
            className={fieldClassName}
        >
            <NumberField {...numberFieldProps} disabled={disabled} required={required}>
                <NumberFieldGroup className={className}>
                    <NumberFieldDecrement aria-label={`Decrease ${label}`} />
                    <NumberFieldInput
                        ref={ref}
                        id={id}
                        required={required}
                        disabled={disabled}
                        readOnly={readOnly}
                        aria-invalid={Boolean(error)}
                        aria-describedby={getFieldDescribedBy(
                            id,
                            ariaDescribedBy,
                            description,
                            error,
                        )}
                        className={inputClassName}
                    />
                    <NumberFieldIncrement aria-label={`Increase ${label}`} />
                </NumberFieldGroup>
            </NumberField>
        </FormField>
    ),
)

NumberInputField.displayName = 'NumberInputField'
