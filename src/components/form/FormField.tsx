import type { ReactNode } from 'react'
import { Field, FieldLabel, FieldError, FieldDescription } from './Field'

export interface FormFieldProps {
    id: string
    label: string
    error?: string
    description?: string
    required?: boolean
    disabled?: boolean
    children: ReactNode
    className?: string
}

export const FormField = ({
    id,
    label,
    error,
    description,
    required = false,
    disabled = false,
    children,
    className,
}: FormFieldProps) => {
    return (
        <Field className={className} invalid={Boolean(error)} disabled={disabled}>
            <FieldLabel htmlFor={id}>
                {label}
                {required && (
                    <span className="ml-1 text-destructive-border" aria-hidden="true">
                        *
                    </span>
                )}
            </FieldLabel>

            {children}

            {description && (
                <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
            )}

            <FieldError id={`${id}-error`}>{error}</FieldError>
        </Field>
    )
}
