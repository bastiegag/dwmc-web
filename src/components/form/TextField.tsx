import { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { FormField } from './FormField'
import { cn } from '@/lib/utils'

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string
    label: string
    error?: string
    required?: boolean
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    ({ id, label, error, required, className, ...props }, ref) => (
        <FormField id={id} label={label} error={error} required={required}>
            <Input
                id={id}
                ref={ref}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={cn(
                    error && 'border-destructive focus-visible:ring-destructive',
                    className,
                )}
                {...props}
            />
        </FormField>
    ),
)
TextField.displayName = 'TextField'
