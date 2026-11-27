import { forwardRef } from 'react'
import type { ChangeEventHandler, FocusEventHandler, ReactNode } from 'react'
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui'
import { FormField } from './FormField'
import { getFieldDescribedBy } from './fieldUtils'

export interface ComboboxFieldProps {
    id: string
    label: string
    options: string[]
    value?: string | null
    defaultValue?: string | null
    onValueChange?: (value: string | null) => void
    name?: string
    description?: string
    error?: string
    placeholder?: string
    emptyMessage?: string
    required?: boolean
    disabled?: boolean
    readOnly?: boolean
    renderOption?: (option: string) => ReactNode
    children?: ReactNode
    className?: string
    fieldClassName?: string
    onInputChange?: ChangeEventHandler<HTMLInputElement>
    onBlur?: FocusEventHandler<HTMLInputElement>
    'aria-describedby'?: string
}

export const ComboboxField = forwardRef<HTMLInputElement, ComboboxFieldProps>(
    (
        {
            id,
            label,
            options,
            value,
            defaultValue,
            onValueChange,
            name,
            description,
            error,
            placeholder = 'Choose an option',
            emptyMessage = 'No options found.',
            required,
            disabled,
            readOnly,
            renderOption,
            children,
            className,
            fieldClassName,
            onInputChange,
            onBlur,
            'aria-describedby': ariaDescribedBy,
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
            <Combobox
                items={options}
                value={value}
                defaultValue={defaultValue}
                onValueChange={onValueChange}
                disabled={disabled}
            >
                <ComboboxInput
                    ref={ref}
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                    aria-invalid={Boolean(error)}
                    aria-required={required || undefined}
                    aria-describedby={getFieldDescribedBy(id, ariaDescribedBy, description, error)}
                    onChange={onInputChange}
                    onBlur={onBlur}
                    className={className}
                />
                <ComboboxContent>
                    {children ?? (
                        <>
                            <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
                            <ComboboxList>
                                {(option: string) => (
                                    <ComboboxItem key={option} value={option}>
                                        {renderOption ? renderOption(option) : option}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </>
                    )}
                </ComboboxContent>
            </Combobox>
        </FormField>
    ),
)

ComboboxField.displayName = 'ComboboxField'
