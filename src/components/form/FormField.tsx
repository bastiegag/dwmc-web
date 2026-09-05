import { type ReactNode } from 'react'
import { Label } from '@/components/ui'
import { cn } from '@/lib/utils'

interface FormFieldProps {
    id: string
    label: string
    error?: string
    required?: boolean
    children: ReactNode
    className?: string
}

export const FormField = ({ id, label, error, required, children, className }: FormFieldProps) => {
    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={id}>
                {label}
                {required && (
                    <span className="ml-1 text-destructive" aria-hidden="true">
                        *
                    </span>
                )}
            </Label>
            {children}
            {error && (
                <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    )
}
