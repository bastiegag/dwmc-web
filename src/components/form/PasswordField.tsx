import { forwardRef, useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Input, Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { FormField } from './FormField'

export interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    id: string
    label: string
    error?: string
    description?: string
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
    (
        {
            id,
            label,
            error,
            description,
            required,
            disabled,
            readOnly,
            className,
            'aria-describedby': ariaDescribedBy,
            ...props
        },
        ref,
    ) => {
        const [visible, setVisible] = useState(false)

        const describedBy =
            [ariaDescribedBy, description && `${id}-description`, error && `${id}-error`]
                .filter(Boolean)
                .join(' ') || undefined

        return (
            <FormField
                id={id}
                label={label}
                error={error}
                description={description}
                required={required}
                disabled={disabled}
            >
                <div className="relative">
                    <Input
                        {...props}
                        ref={ref}
                        id={id}
                        type={visible ? 'text' : 'password'}
                        required={required}
                        disabled={disabled}
                        readOnly={readOnly}
                        aria-invalid={Boolean(error)}
                        aria-describedby={describedBy}
                        className={cn(
                            'pr-11',
                            error && 'border-destructive focus-visible:ring-destructive',
                            className,
                        )}
                    />

                    <Button
                        type="button"
                        variant="link"
                        color="default"
                        icon
                        disabled={disabled}
                        aria-label={visible ? 'Hide password' : 'Show password'}
                        aria-pressed={visible}
                        onClick={() => setVisible((value) => !value)}
                        className={cn(
                            'absolute inset-y-0 right-0',
                            'h-full w-10 rounded-l-none rounded-r-md p-0',
                            'text-muted-foreground',
                            'hover:bg-transparent hover:text-foreground',
                            'focus-visible:z-10',
                        )}
                    >
                        {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                    </Button>
                </div>
            </FormField>
        )
    },
)

PasswordField.displayName = 'PasswordField'
