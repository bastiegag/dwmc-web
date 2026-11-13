import {
    type HTMLAttributes,
    type LabelHTMLAttributes,
    type FieldsetHTMLAttributes,
    forwardRef,
} from 'react'
import { cn } from '@/lib/utils'

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
    invalid?: boolean
    disabled?: boolean
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(
    ({ className, invalid, disabled, ...props }, ref) => (
        <div
            ref={ref}
            data-invalid={invalid || undefined}
            data-disabled={disabled || undefined}
            className={cn('space-y-1.5', className)}
            {...props}
        />
    ),
)
Field.displayName = 'Field'

export const FieldLabel = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => (
        <label
            ref={ref}
            htmlFor={props.htmlFor}
            className={cn(
                'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                className,
            )}
            {...props}
        />
    ),
)
FieldLabel.displayName = 'FieldLabel'

export const FieldDescription = forwardRef<
    HTMLParagraphElement,
    HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs text-muted-foreground', className)} {...props} />
))
FieldDescription.displayName = 'FieldDescription'

export interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {
    errors?: Array<{ message?: string } | undefined>
}

export const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(
    ({ className, errors, children, ...props }, ref) => {
        const message = children ?? errors?.find((error) => error?.message)?.message
        if (!message) return null
        return (
            <p
                ref={ref}
                role="alert"
                className={cn('text-xs text-destructive', className)}
                {...props}
            >
                {message}
            </p>
        )
    },
)
FieldError.displayName = 'FieldError'

export const Fieldset = forwardRef<
    HTMLFieldSetElement,
    FieldsetHTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => (
    <fieldset ref={ref} className={cn('space-y-4', className)} {...props} />
))
Fieldset.displayName = 'Fieldset'

export const FieldLegend = forwardRef<HTMLLegendElement, HTMLAttributes<HTMLLegendElement>>(
    ({ className, ...props }, ref) => (
        <legend ref={ref} className={cn('text-base font-semibold', className)} {...props} />
    ),
)
FieldLegend.displayName = 'FieldLegend'
