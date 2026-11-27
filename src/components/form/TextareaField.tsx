import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { Textarea } from '@/components/ui'
import { FormField } from './FormField'
import { getFieldDescribedBy } from './fieldUtils'

export interface TextareaFieldProps extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'id' | 'aria-invalid' | 'aria-describedby'
> {
    id: string
    label: string
    description?: string
    error?: string
    fieldClassName?: string
    'aria-describedby'?: string
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
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
            <Textarea
                {...props}
                ref={ref}
                id={id}
                required={required}
                disabled={disabled}
                aria-invalid={Boolean(error)}
                aria-describedby={getFieldDescribedBy(id, ariaDescribedBy, description, error)}
                className={className}
            />
        </FormField>
    ),
)

TextareaField.displayName = 'TextareaField'
