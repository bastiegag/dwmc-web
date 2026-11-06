import { forwardRef, useId, useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui'
import { Field, FieldDescription, FieldError, FieldLabel } from './Field'
import { cn } from '@/lib/utils'

export interface CurrencyInputProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'type'
> {
    value?: string | null
    defaultValue?: string | null
    onValueChange?: (value: string | null) => void
    currency?: string
    locale?: string
    label?: string
    description?: string
    error?: string
    allowNegative?: boolean
    min?: string
    max?: string
}

const validCurrency = /^-?\d+(?:\.\d{0,2})?$/

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
    (
        {
            value,
            defaultValue = null,
            onValueChange,
            currency = 'CAD',
            locale = 'en-CA',
            label,
            description,
            error,
            allowNegative = false,
            min,
            max,
            id: providedId,
            className,
            onBlur,
            ...props
        },
        ref,
    ) => {
        const generatedId = useId()
        const id = providedId ?? generatedId
        const isControlled = value !== undefined
        const [draft, setDraft] = useState(value ?? defaultValue ?? '')
        const text = isControlled ? (value ?? '') : draft
        const format = (raw: string) => {
            if (!raw || !validCurrency.test(raw) || (!allowNegative && raw.startsWith('-')))
                return raw
            const amount = Number(raw)
            if (!Number.isFinite(amount)) return raw
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency,
                minimumFractionDigits: 2,
            }).format(amount)
        }
        return (
            <Field invalid={!!error}>
                {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
                <Input
                    {...props}
                    ref={ref}
                    id={id}
                    type="text"
                    inputMode="decimal"
                    value={text}
                    aria-invalid={!!error}
                    aria-describedby={
                        [description && `${id}-description`, error && `${id}-error`]
                            .filter(Boolean)
                            .join(' ') || undefined
                    }
                    className={cn(
                        error && 'border-destructive focus-visible:ring-destructive',
                        className,
                    )}
                    onChange={(event) => {
                        const next = event.target.value.replace(/,/g, '')
                        if (next === '' || validCurrency.test(next)) {
                            if (!isControlled) setDraft(next)
                            onValueChange?.(next === '' ? null : next)
                        }
                    }}
                    onBlur={(event) => {
                        const raw = event.currentTarget.value
                        if (raw && validCurrency.test(raw)) {
                            const formatted = format(raw)
                            if (!isControlled) setDraft(formatted)
                        }
                        onBlur?.(event)
                    }}
                    min={min}
                    max={max}
                />
                {description && (
                    <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
                )}
                <FieldError id={`${id}-error`}>{error}</FieldError>
            </Field>
        )
    },
)
CurrencyInput.displayName = 'CurrencyInput'
