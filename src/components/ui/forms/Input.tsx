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
                'transition motion-reduce:transition-none',

                // Read-only
                'read-only:bg-muted',
                'read-only:text-muted-foreground',
                'read-only:border-muted-border',

                className,
            )}
            {...props}
        />
    ),
)

Input.displayName = 'Input'
