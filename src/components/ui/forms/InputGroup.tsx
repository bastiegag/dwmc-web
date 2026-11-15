import { forwardRef } from 'react'
import type { HTMLAttributes, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type InputGroupProps = HTMLAttributes<HTMLDivElement>

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                // Layout
                'flex h-10 w-full min-w-0 items-center',
                'rounded-md border border-input bg-card',

                // Focus
                'ring-offset-background',
                'focus-within:ring-2',
                'focus-within:ring-ring',
                'focus-within:ring-offset-2',

                // Invalid
                'has-[input[aria-invalid=true]]:border-destructive',
                'has-[input[aria-invalid=true]]:focus-within:ring-destructive',

                // Disabled
                'has-[input:disabled]:opacity-50',

                // Nested input
                '[&>input]:h-full',
                '[&>input]:min-w-0',
                '[&>input]:flex-1',
                '[&>input]:border-0',
                '[&>input]:bg-transparent',
                '[&>input]:shadow-none',
                '[&>input]:outline-none',
                '[&>input]:ring-0',
                '[&>input]:ring-offset-0',
                '[&>input:focus-visible]:ring-0',
                '[&>input:focus-visible]:ring-offset-0',

                className,
            )}
            {...props}
        />
    ),
)

InputGroup.displayName = 'InputGroup'

export type InputGroupAddonProps = HTMLAttributes<HTMLDivElement>

export const InputGroupAddon = forwardRef<HTMLDivElement, InputGroupAddonProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'flex shrink-0 items-center justify-center',
                'px-3 text-sm text-muted-foreground',
                'select-none',
                className,
            )}
            {...props}
        />
    ),
)

InputGroupAddon.displayName = 'InputGroupAddon'

export type InputGroupButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const InputGroupButton = forwardRef<HTMLButtonElement, InputGroupButtonProps>(
    ({ className, type = 'button', ...props }, ref) => (
        <button
            ref={ref}
            type={type}
            className={cn(
                // Layout
                'mx-1 inline-flex h-8 shrink-0 items-center',
                'justify-center gap-1.5 rounded-md px-2',

                // Typography
                'text-sm font-medium text-foreground',

                // Interaction
                'cursor-pointer transition-colors',
                'hover:bg-muted',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-ring',
                'focus-visible:ring-inset',

                // Disabled
                'disabled:cursor-not-allowed',
                'disabled:opacity-50',

                className,
            )}
            {...props}
        />
    ),
)

InputGroupButton.displayName = 'InputGroupButton'
