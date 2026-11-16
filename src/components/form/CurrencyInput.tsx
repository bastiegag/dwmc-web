import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FocusEvent, InputHTMLAttributes } from 'react'

import { Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import { Field, FieldDescription, FieldError, FieldLabel } from './Field'

type Amount = string | null

export interface CurrencyInputProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'type' | 'min' | 'max'
> {
    value?: Amount
    defaultValue?: Amount
    onValueChange?: (value: Amount) => void
    currency?: string
    locale?: string
    label?: string
    description?: string
    error?: string
    allowNegative?: boolean
    min?: string
    max?: string
}

const DECIMAL_PATTERN = /^\d*\.?\d*$/
const SIGNED_DECIMAL_PATTERN = /^-?\d*\.?\d*$/

const decimalsOf = (value: string): number => value.split('.')[1]?.length ?? 0

/**
 * Converts editable text to a decimal string.
 * Returns undefined for incomplete input.
 */
const normalizeAmount = (text: string): Amount | undefined => {
    if (text === '') return null

    const negative = text.startsWith('-')
    const body = negative ? text.slice(1) : text
    const [whole = '', fraction] = body.split('.')

    if (!whole && !fraction) return undefined

    const isZero = /^0*(\.0*)?$/.test(body)
    const sign = negative && !isZero ? '-' : ''
    const integer = whole || '0'

    return fraction ? `${sign}${integer}.${fraction}` : `${sign}${integer}`
}

/**
 * Validates editable text without converting to Number.
 */
const isValidEdit = (text: string, allowNegative: boolean, fractionDigits: number): boolean => {
    const pattern = allowNegative ? SIGNED_DECIMAL_PATTERN : DECIMAL_PATTERN

    return pattern.test(text) && decimalsOf(text) <= fractionDigits
}

/**
 * Compares decimal strings without floating-point errors.
 */
const compareDecimals = (a: string, b: string): number => {
    const scale = Math.max(decimalsOf(a), decimalsOf(b))

    const toUnits = (value: string): bigint => {
        const negative = value.startsWith('-')
        const unsigned = negative ? value.slice(1) : value
        const [whole = '0', fraction = ''] = unsigned.split('.')

        const units = BigInt(`${whole || '0'}${fraction.padEnd(scale, '0')}`)

        return negative ? -units : units
    }

    const left = toUnits(a)
    const right = toUnits(b)

    return left === right ? 0 : left < right ? -1 : 1
}

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
            required = false,
            min,
            max,
            id: providedId,
            className,
            onFocus,
            onBlur,
            disabled,
            'aria-describedby': ariaDescribedBy,
            ...props
        },
        ref,
    ) => {
        const generatedId = useId()
        const id = providedId ?? generatedId

        const isControlled = value !== undefined

        const [internalValue, setInternalValue] = useState<Amount>(defaultValue)

        const committed = isControlled ? value : internalValue

        // null means the input is displaying its formatted value.
        const [editText, setEditText] = useState<string | null>(null)

        const lastEmitted = useRef<Amount>(committed)

        const formatter = useMemo(
            () =>
                new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency,
                }),
            [locale, currency],
        )

        const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 2

        const formatAmount = useCallback(
            (amount: string): string => {
                const digits = decimalsOf(amount)

                const displayFormatter =
                    digits <= fractionDigits
                        ? formatter
                        : new Intl.NumberFormat(locale, {
                              style: 'currency',
                              currency,
                              minimumFractionDigits: fractionDigits,
                              maximumFractionDigits: digits,
                          })

                // Runtime string input preserves decimal precision.
                return displayFormatter.format(amount as unknown as number)
            },
            [formatter, fractionDigits, locale, currency],
        )

        // Synchronize external controlled updates during editing.
        useEffect(() => {
            if (editText !== null && committed !== lastEmitted.current) {
                lastEmitted.current = committed
                setEditText(committed ?? '')
            }
        }, [committed, editText])

        const rangeError = useMemo(() => {
            if (committed === null) return null

            if (min !== undefined && compareDecimals(committed, min) < 0) {
                return `Enter an amount of at least ${formatAmount(min)}.`
            }

            if (max !== undefined && compareDecimals(committed, max) > 0) {
                return `Enter an amount of at most ${formatAmount(max)}.`
            }

            return null
        }, [committed, min, max, formatAmount])

        const message = error ?? (editText === null ? rangeError : null)

        const descriptionId = `${id}-description`
        const errorId = `${id}-error`

        const describedBy =
            [ariaDescribedBy, description && descriptionId, message && errorId]
                .filter(Boolean)
                .join(' ') || undefined

        const emit = (next: Amount) => {
            lastEmitted.current = next

            if (!isControlled) {
                setInternalValue(next)
            }

            onValueChange?.(next)
        }

        const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
            setEditText(committed ?? '')
            onFocus?.(event)
        }

        const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
            // Restore the last committed value for incomplete edits.
            setEditText(null)
            onBlur?.(event)
        }

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            const input = event.currentTarget
            const next = input.value
            const previous = editText ?? ''

            if (!isValidEdit(next, allowNegative, fractionDigits)) {
                // Restore rejected input and caret position.
                const caret = input.selectionStart ?? next.length

                input.value = previous

                const position = Math.max(0, caret - (next.length - previous.length))

                input.setSelectionRange(position, position)
                return
            }

            setEditText(next)

            const normalized = normalizeAmount(next)

            if (normalized !== undefined && normalized !== committed) {
                emit(normalized)
            }
        }

        return (
            <Field invalid={Boolean(message)} disabled={disabled}>
                {label && (
                    <FieldLabel htmlFor={id}>
                        {label}
                        {required && (
                            <span className="ml-1 text-destructive" aria-hidden="true">
                                *
                            </span>
                        )}
                    </FieldLabel>
                )}

                <Input
                    {...props}
                    ref={ref}
                    id={id}
                    type="text"
                    required={required}
                    inputMode="decimal"
                    autoComplete="off"
                    disabled={disabled}
                    value={editText ?? (committed === null ? '' : formatAmount(committed))}
                    aria-invalid={Boolean(message)}
                    aria-describedby={describedBy}
                    className={cn(
                        message && 'border-destructive focus-visible:ring-destructive',
                        className,
                    )}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />

                {description && (
                    <FieldDescription id={descriptionId}>{description}</FieldDescription>
                )}

                <FieldError id={errorId}>{message}</FieldError>
            </Field>
        )
    },
)

CurrencyInput.displayName = 'CurrencyInput'
