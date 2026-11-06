import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FocusEvent, InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui'
import { Field, FieldDescription, FieldError, FieldLabel } from './Field'
import { cn } from '@/lib/utils'

export interface CurrencyInputProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'type' | 'min' | 'max'
> {
    /** Controlled decimal string (e.g. `"12.50"`), `null` for empty, or `undefined` for uncontrolled usage. */
    value?: string | null
    /** Initial decimal string for uncontrolled usage. */
    defaultValue?: string | null
    onValueChange?: (value: string | null) => void
    currency?: string
    /** Used for display formatting on blur. Editing always uses a `.` decimal separator. */
    locale?: string
    label?: string
    description?: string
    error?: string
    allowNegative?: boolean
    /** Minimum allowed decimal string, validated on blur. */
    min?: string
    /** Maximum allowed decimal string, validated on blur. */
    max?: string
}

type Committed = string | null

const editPattern = /^\d*\.?\d*$/
const signedEditPattern = /^-?\d*\.?\d*$/

const decimalsOf = (value: string) => value.split('.')[1]?.length ?? 0

/** Returns `undefined` for incomplete input such as `-` or `.`, which must not be emitted. */
const toCommitted = (text: string): Committed | undefined => {
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

const isAcceptedEdit = (
    text: string,
    { allowNegative, fractionDigits }: { allowNegative: boolean; fractionDigits: number },
) => {
    if (!(allowNegative ? signedEditPattern : editPattern).test(text)) return false
    const dot = text.indexOf('.')
    return dot === -1 || text.length - dot - 1 <= fractionDigits
}

/** Compares two decimal strings exactly, without floating-point arithmetic. */
const compareDecimals = (a: string, b: string) => {
    const scale = Math.max(decimalsOf(a), decimalsOf(b))
    const toUnits = (value: string) => {
        const negative = value.startsWith('-')
        const [whole = '0', fraction = ''] = (negative ? value.slice(1) : value).split('.')
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
            min,
            max,
            id: providedId,
            className,
            onFocus,
            onBlur,
            ...props
        },
        ref,
    ) => {
        const generatedId = useId()
        const id = providedId ?? generatedId
        const isControlled = value !== undefined
        const [internalValue, setInternalValue] = useState<Committed>(defaultValue)
        const committed: Committed = isControlled ? value : internalValue

        // Non-null only while focused; holds the editable decimal text.
        const [editText, setEditText] = useState<string | null>(null)
        const lastEmitted = useRef<Committed>(committed)

        const fractionDigits = useMemo(
            () =>
                new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions()
                    .maximumFractionDigits ?? 2,
            [locale, currency],
        )

        const formatDisplay = (amount: string) =>
            new Intl.NumberFormat(locale, {
                style: 'currency',
                currency,
                minimumFractionDigits: fractionDigits,
                // Never round a value that carries more precision than the currency displays.
                maximumFractionDigits: Math.max(fractionDigits, decimalsOf(amount)),
            }).format(amount as unknown as number)

        // Keep the edit buffer aligned when the controlled value changes externally during focus.
        useEffect(() => {
            if (editText !== null && committed !== lastEmitted.current) {
                lastEmitted.current = committed
                setEditText(committed ?? '')
            }
        }, [committed, editText])

        const rangeError =
            committed === null
                ? null
                : min !== undefined && compareDecimals(committed, min) < 0
                  ? `Enter an amount of at least ${formatDisplay(min)}.`
                  : max !== undefined && compareDecimals(committed, max) > 0
                    ? `Enter an amount of at most ${formatDisplay(max)}.`
                    : null
        const message = error ?? (editText === null ? rangeError : null)
        const descriptionId = `${id}-description`
        const errorId = `${id}-error`

        const emit = (next: Committed) => {
            lastEmitted.current = next
            if (!isControlled) setInternalValue(next)
            onValueChange?.(next)
        }

        const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
            setEditText(committed ?? '')
            onFocus?.(event)
        }

        const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
            // Incomplete text such as "-" reverts to the last committed value here.
            setEditText(null)
            onBlur?.(event)
        }

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            const target = event.currentTarget
            const next = target.value
            const previous = editText ?? ''
            if (!isAcceptedEdit(next, { allowNegative, fractionDigits })) {
                // Reject the keystroke and keep the caret where the user was typing.
                const caret = target.selectionStart ?? next.length
                target.value = previous
                const position = Math.max(0, caret - (next.length - previous.length))
                target.setSelectionRange(position, position)
                return
            }
            setEditText(next)
            const normalized = toCommitted(next)
            if (normalized !== undefined && normalized !== committed) emit(normalized)
        }

        return (
            <Field invalid={!!message}>
                {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
                <Input
                    autoComplete="off"
                    {...props}
                    ref={ref}
                    id={id}
                    type="text"
                    inputMode="decimal"
                    value={editText ?? (committed === null ? '' : formatDisplay(committed))}
                    aria-invalid={!!message}
                    aria-describedby={
                        [description && descriptionId, message && errorId]
                            .filter(Boolean)
                            .join(' ') || undefined
                    }
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
