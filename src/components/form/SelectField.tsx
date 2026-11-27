import { forwardRef, useState } from 'react'
import type { ComponentPropsWithoutRef, ComponentRef, ReactNode } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectGroupLabel,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui'
import type { SelectContentProps } from '@/components/ui'
import { FormField } from './FormField'
import { getFieldDescribedBy } from './fieldUtils'

export interface SelectFieldOption {
    value: string
    label: ReactNode
    disabled?: boolean
}

export interface SelectFieldGroup {
    label: ReactNode
    options: SelectFieldOption[]
}

export interface SelectFieldProps extends Omit<
    ComponentPropsWithoutRef<typeof Select>,
    'children'
> {
    id: string
    label: string
    description?: string
    error?: string
    placeholder?: string
    options?: SelectFieldOption[]
    groups?: SelectFieldGroup[]
    valueLabel?: ReactNode
    children?: ReactNode
    className?: string
    fieldClassName?: string
    contentProps?: Omit<SelectContentProps, 'children'>
    onBlur?: React.FocusEventHandler<HTMLButtonElement>
    'aria-describedby'?: string
}

export const SelectField = forwardRef<ComponentRef<typeof SelectTrigger>, SelectFieldProps>(
    (
        {
            id,
            label,
            description,
            error,
            placeholder = 'Select an option',
            options,
            groups,
            valueLabel,
            children,
            className,
            fieldClassName,
            contentProps,
            required,
            disabled,
            value,
            defaultValue,
            onValueChange,
            onBlur,
            'aria-describedby': ariaDescribedBy,
            ...selectProps
        },
        ref,
    ) => {
        const [uncontrolledValue, setUncontrolledValue] = useState(value ?? defaultValue)
        const describedBy = getFieldDescribedBy(id, ariaDescribedBy, description, error)
        const selectedValue = value !== undefined ? value : uncontrolledValue
        const allOptions = [
            ...(options ?? []),
            ...(groups?.flatMap((group) => group.options) ?? []),
        ]
        const selectedLabel =
            valueLabel ?? allOptions.find((option) => option.value === selectedValue)?.label
        const defaultContent = (
            <>
                {options?.map((option) => (
                    <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                    </SelectItem>
                ))}
                {groups?.map((group, index) => (
                    <SelectGroup key={index}>
                        <SelectGroupLabel>{group.label}</SelectGroupLabel>
                        {group.options.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                ))}
            </>
        )
        const handleValueChange: NonNullable<SelectFieldProps['onValueChange']> = (
            nextValue,
            ...details
        ) => {
            if (value === undefined) setUncontrolledValue(nextValue)
            onValueChange?.(nextValue, ...details)
        }

        return (
            <FormField
                id={id}
                label={label}
                description={description}
                error={error}
                required={required}
                disabled={disabled}
                className={fieldClassName}
            >
                <Select
                    {...selectProps}
                    value={value}
                    defaultValue={defaultValue}
                    onValueChange={handleValueChange}
                    required={required}
                    disabled={disabled}
                >
                    <SelectTrigger
                        ref={ref}
                        id={id}
                        aria-invalid={Boolean(error)}
                        aria-required={required || undefined}
                        aria-describedby={describedBy}
                        data-invalid={Boolean(error) || undefined}
                        onBlur={onBlur}
                        className={className}
                    >
                        <SelectValue placeholder={placeholder}>{selectedLabel}</SelectValue>
                    </SelectTrigger>
                    <SelectContent {...contentProps}>{children ?? defaultContent}</SelectContent>
                </Select>
            </FormField>
        )
    },
)

SelectField.displayName = 'SelectField'
