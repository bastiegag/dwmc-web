import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', ...props }, ref) => (
        <input
            ref={ref}
            type={type}
            className={cn(
                // Layout
                'flex h-10 w-full min-w-0 rounded-md',
                'border border-input bg-card',
                'px-3 py-2 text-sm text-foreground',

                // Text
                'placeholder:text-muted-foreground',

                // File input
                'file:mr-3 file:border-0',
                'file:bg-transparent',
                'file:text-sm file:font-medium',
                'file:text-foreground',

                // Interaction
                'transition-colors',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-ring',
                'focus-visible:ring-offset-2',
                'focus-visible:ring-offset-background',

                // Invalid
                'aria-invalid:border-destructive',
                'aria-invalid:focus-visible:ring-destructive',

                // Read-only
                'read-only:cursor-default',
                'read-only:bg-muted/30',

                // Disabled
                'disabled:cursor-not-allowed',
                'disabled:opacity-50',

                className,
            )}
            {...props}
        />
    ),
)

Input.displayName = 'Input'
