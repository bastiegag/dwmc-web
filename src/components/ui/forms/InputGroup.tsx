import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { Button } from '../actions/Button'
import type { ButtonProps } from '../actions/Button'
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
                'focus-within:ring-2',
                'focus-within:ring-ring/50',
                'focus-within:ring-offset-2',

                // Invalid
                'has-[input[aria-invalid=true]]:border-2',
                'has-[input[aria-invalid=true]]:border-destructive',
                'has-[input[aria-invalid=true]]:focus-within:ring-destructive/25',

                // Disabled
                'has-[input:disabled]:opacity-50',

                // Nested input
                '[&>input]:border-0',
                '[&>input]:opacity-100',
                '[&>input]:bg-transparent',
                '[&>input]:ring-0',
                '[&>input]:ring-offset-0',
                '[&>input:focus-visible]:ring-0',
                '[&>input:read-only]:bg-transparent',

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

export type InputGroupButtonProps = Omit<ButtonProps, 'asChild'>

export const InputGroupButton = forwardRef<HTMLButtonElement, InputGroupButtonProps>(
    (
        { className, type = 'button', variant = 'link', color = 'default', size = 'sm', ...props },
        ref,
    ) => (
        <Button
            ref={ref}
            type={type}
            variant={variant}
            color={color}
            size={size}
            className={cn(
                // Layout
                'mx-1 inline-flex h-8 shrink-0 items-center',
                'rounded-md px-2',

                className,
            )}
            {...props}
        />
    ),
)

InputGroupButton.displayName = 'InputGroupButton'
