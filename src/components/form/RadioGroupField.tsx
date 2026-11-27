import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, Fieldset } from './Field'
import { RadioGroup, RadioGroupItem } from '@/components/ui'

export interface RadioGroupFieldOption {
    value: string
    label: ReactNode
    disabled?: boolean
}

export interface RadioGroupFieldProps extends Omit<
    ComponentPropsWithoutRef<typeof RadioGroup>,
    | 'id'
    | 'children'
    | 'className'
    | 'aria-labelledby'
    | 'aria-describedby'
    | 'aria-invalid'
    | 'aria-required'
> {
    id: string
    label: string
    options: RadioGroupFieldOption[]
    description?: string
    error?: string
    required?: boolean
    className?: string
    fieldClassName?: string
    'aria-describedby'?: string
}

export const RadioGroupField = forwardRef<HTMLButtonElement, RadioGroupFieldProps>(
    (
        {
            id,
            label,
            options,
            description,
            error,
            required,
            disabled,
            className,
            fieldClassName,
            value,
            defaultValue,
            'aria-describedby': ariaDescribedBy,
            ...radioGroupProps
        },
        ref,
    ) => {
        const describedBy =
            [ariaDescribedBy, description && `${id}-description`, error && `${id}-error`]
                .filter(Boolean)
                .join(' ') || undefined
        const selectedValue = value !== undefined ? value : defaultValue
        const focusIndex = Math.max(
            0,
            options.findIndex((option) => option.value === selectedValue),
        )

        return (
            <Field invalid={Boolean(error)} disabled={disabled} className={fieldClassName}>
                <Fieldset disabled={disabled}>
                    <FieldLegend id={`${id}-legend`}>
                        {label}
                        {required && (
                            <span className="ml-1 text-destructive-border" aria-hidden="true">
                                *
                            </span>
                        )}
                    </FieldLegend>
                    <RadioGroup
                        {...radioGroupProps}
                        id={id}
                        value={value}
                        defaultValue={defaultValue}
                        disabled={disabled}
                        required={required}
                        aria-labelledby={`${id}-legend`}
                        aria-describedby={describedBy}
                        aria-invalid={Boolean(error)}
                        aria-required={required || undefined}
                        className={className}
                    >
                        {options.map((option, index) => {
                            const optionId = `${id}-${index}`
                            const optionDisabled = disabled || option.disabled

                            return (
                                <Field
                                    key={option.value}
                                    disabled={optionDisabled}
                                    className="flex items-center gap-2 space-y-0"
                                >
                                    <RadioGroupItem
                                        ref={index === focusIndex ? ref : undefined}
                                        id={optionId}
                                        value={option.value}
                                        disabled={optionDisabled}
                                    />
                                    <FieldLabel htmlFor={optionId}>{option.label}</FieldLabel>
                                </Field>
                            )
                        })}
                    </RadioGroup>
                    {description && (
                        <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
                    )}
                    <FieldError id={`${id}-error`}>{error}</FieldError>
                </Fieldset>
            </Field>
        )
    },
)

RadioGroupField.displayName = 'RadioGroupField'
