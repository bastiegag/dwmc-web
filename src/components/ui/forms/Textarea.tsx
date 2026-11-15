import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => (
        <textarea
            ref={ref}
            className={cn(
                // Layout
                'flex min-h-24 w-full min-w-0',
                'resize-y rounded-md',
                'border border-input bg-card',
                'px-3 py-2',

                // Typography
                'text-sm leading-relaxed text-foreground',
                'placeholder:text-muted-foreground',

                // Interaction
                'transition-colors motion-reduce:transition-none',
                'focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-ring',
                'focus-visible:ring-offset-2',
                'focus-visible:ring-offset-background',

                // Invalid
                'aria-invalid:border-destructive',
                'aria-invalid:focus-visible:ring-destructive',

                // Read only
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

Textarea.displayName = 'Textarea'
