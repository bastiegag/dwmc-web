import { forwardRef } from 'react'
import type { ComponentRef } from 'react'
import { DatePicker } from '@/components/ui'
import type { DatePickerProps } from '@/components/ui'
import { FormField } from './FormField'
import { getFieldDescribedBy } from './fieldUtils'

export interface DatePickerFieldProps extends Omit<
    DatePickerProps,
    'id' | 'className' | 'aria-label'
> {
    id: string
    label: string
    description?: string
    error?: string
    required?: boolean
    fieldClassName?: string
    className?: string
    'aria-describedby'?: string
}

export const DatePickerField = forwardRef<ComponentRef<typeof DatePicker>, DatePickerFieldProps>(
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
            ...datePickerProps
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
            <>
                <DatePicker
                    {...datePickerProps}
                    ref={ref}
                    id={id}
                    disabled={disabled}
                    aria-describedby={[
                        getFieldDescribedBy(id, ariaDescribedBy, description, error),
                        required ? `${id}-required` : undefined,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    data-invalid={Boolean(error) || undefined}
                    data-required={required || undefined}
                    className={className}
                />
                {required && (
                    <span id={`${id}-required`} className="sr-only">
                        Required
                    </span>
                )}
            </>
        </FormField>
    ),
)

DatePickerField.displayName = 'DatePickerField'
