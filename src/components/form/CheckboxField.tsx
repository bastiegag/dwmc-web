import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ComponentRef } from 'react'
import { Checkbox } from '@/components/ui'
import { Field, FieldDescription, FieldError, FieldLabel } from './Field'

export interface CheckboxFieldProps extends Omit<
    ComponentPropsWithoutRef<typeof Checkbox>,
    'children' | 'id' | 'className' | 'aria-invalid' | 'aria-describedby'
> {
    id: string
    label: string
    description?: string
    error?: string
    className?: string
    fieldClassName?: string
    'aria-describedby'?: string
}

export const CheckboxField = forwardRef<ComponentRef<typeof Checkbox>, CheckboxFieldProps>(
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
            ...props
        },
        ref,
    ) => {
        const describedBy =
            [ariaDescribedBy, description && `${id}-description`, error && `${id}-error`]
                .filter(Boolean)
                .join(' ') || undefined

        return (
            <Field invalid={Boolean(error)} disabled={disabled} className={fieldClassName}>
                <div className="flex items-center gap-2">
                    <Checkbox
                        {...props}
                        ref={ref}
                        id={id}
                        required={required}
                        disabled={disabled}
                        aria-invalid={Boolean(error)}
                        aria-describedby={describedBy}
                        className={className}
                    />
                    <FieldLabel htmlFor={id}>
                        {label}
                        {required && (
                            <span className="ml-1 text-destructive-border" aria-hidden="true">
                                *
                            </span>
                        )}
                    </FieldLabel>
                </div>
                {description && (
                    <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
                )}
                <FieldError id={`${id}-error`}>{error}</FieldError>
            </Field>
        )
    },
)

CheckboxField.displayName = 'CheckboxField'
