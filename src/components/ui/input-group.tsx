import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const InputGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'flex h-10 w-full items-center rounded-md border border-input bg-card ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 [&>input]:min-w-0 [&>input]:flex-1 [&>input]:border-0 [&>input]:bg-transparent [&>input]:outline-none',
                className,
            )}
            {...props}
        />
    ),
)
InputGroup.displayName = 'InputGroup'

export const InputGroupAddon = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex items-center px-3 text-sm text-muted-foreground', className)}
            {...props}
        />
    ),
)
InputGroupAddon.displayName = 'InputGroupAddon'

export const InputGroupButton = forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, type = 'button', ...props }, ref) => (
    <button
        ref={ref}
        type={type}
        className={cn(
            'mx-1 shrink-0 rounded px-2 py-1 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
            className,
        )}
        {...props}
    />
))
InputGroupButton.displayName = 'InputGroupButton'
