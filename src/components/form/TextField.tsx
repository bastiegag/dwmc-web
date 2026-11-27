import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

import { Input } from '@/components/ui'
import { FormField } from './FormField'

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string
    label: string
    description?: string
    error?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    (
        {
            id,
            label,
            description,
            error,
            required,
            disabled,
            className,
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
            <FormField
                id={id}
                label={label}
                description={description}
                error={error}
                required={required}
                disabled={disabled}
            >
                <Input
                    {...props}
                    ref={ref}
                    id={id}
                    required={required}
                    disabled={disabled}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className={className}
                />
            </FormField>
        )
    },
)

TextField.displayName = 'TextField'
