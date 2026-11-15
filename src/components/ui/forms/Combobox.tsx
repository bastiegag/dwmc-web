import * as React from 'react'
import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Combobox = ComboboxPrimitive.Root

export const ComboboxInputGroup = React.forwardRef<
    React.ComponentRef<typeof ComboboxPrimitive.InputGroup>,
    React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.InputGroup>
>(({ className, ...props }, ref) => (
    <ComboboxPrimitive.InputGroup
        ref={ref}
        className={cn('relative w-full [&>input]:pr-10', className)}
        {...props}
    />
))
ComboboxInputGroup.displayName = 'ComboboxInputGroup'

export const ComboboxInput = React.forwardRef<
    React.ComponentRef<typeof ComboboxPrimitive.Input>,
    React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Input>
>(({ className, ...props }, ref) => (
    <ComboboxPrimitive.Input
        ref={ref}
        className={cn(
            'flex h-10 w-full rounded-md border border-input',
            'bg-card px-3 py-2 text-sm text-foreground',
            'placeholder:text-muted-foreground',

            'outline-none transition-colors motion-reduce:transition-none',
            'focus-visible:ring-2 focus-visible:ring-ring',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-background',

            'disabled:cursor-not-allowed',
            'disabled:opacity-50',

            'aria-invalid:border-destructive',
            'aria-invalid:ring-destructive',

            className,
        )}
        {...props}
    />
))
ComboboxInput.displayName = 'ComboboxInput'

export const ComboboxTrigger = React.forwardRef<
    React.ComponentRef<typeof ComboboxPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <ComboboxPrimitive.Trigger
        ref={ref}
        aria-label={props['aria-label'] ?? 'Toggle options'}
        className={cn(
            'absolute inset-y-0 right-0',
            'flex w-10 items-center justify-center',
            'rounded-r-md text-muted-foreground',

            'cursor-pointer transition-colors motion-reduce:transition-none',
            'hover:text-foreground',
            'focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-ring',
            'focus-visible:ring-inset',

            'disabled:cursor-not-allowed',
            'disabled:opacity-50',

            className,
        )}
        {...props}
    >
        {children ?? <ChevronsUpDown className="size-4" aria-hidden="true" />}
    </ComboboxPrimitive.Trigger>
))
ComboboxTrigger.displayName = 'ComboboxTrigger'

export type ComboboxContentProps = React.ComponentPropsWithoutRef<
    typeof ComboboxPrimitive.Popup
> & {
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
}

export const ComboboxContent = React.forwardRef<
    React.ComponentRef<typeof ComboboxPrimitive.Popup>,
    ComboboxContentProps
>(({ className, align = 'start', sideOffset = 4, ...props }, ref) => (
    <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner align={align} sideOffset={sideOffset}>
            <ComboboxPrimitive.Popup
                ref={ref}
                className={cn(
                    'z-50 min-w-48',
                    'rounded-md border border-border',
                    'bg-popover p-1 text-popover-foreground',
                    'shadow-md outline-none',

                    className,
                )}
                {...props}
            />
        </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
))
ComboboxContent.displayName = 'ComboboxContent'

export const ComboboxList = React.forwardRef<
    React.ComponentRef<typeof ComboboxPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.List>
>(({ className, ...props }, ref) => (
    <ComboboxPrimitive.List
        ref={ref}
        className={cn('max-h-80 overflow-y-auto overscroll-contain', className)}
        {...props}
    />
))
ComboboxList.displayName = 'ComboboxList'

export const ComboboxEmpty = React.forwardRef<
    React.ComponentRef<typeof ComboboxPrimitive.Empty>,
    React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Empty>
>(({ className, ...props }, ref) => (
    <ComboboxPrimitive.Empty
        ref={ref}
        className={cn('px-3 py-6 text-center', 'text-sm text-muted-foreground', className)}
        {...props}
    />
))
ComboboxEmpty.displayName = 'ComboboxEmpty'

export const ComboboxItem = React.forwardRef<
    React.ComponentRef<typeof ComboboxPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <ComboboxPrimitive.Item
        ref={ref}
        className={cn(
            'relative flex min-h-9 items-center',
            'rounded-sm py-2 pr-3 pl-8',
            'text-sm outline-none',

            'cursor-default select-none',
            'data-highlighted:bg-accent',
            'data-highlighted:text-accent-foreground',

            'data-disabled:pointer-events-none',
            'data-disabled:opacity-50',

            className,
        )}
        {...props}
    >
        <ComboboxPrimitive.ItemIndicator className="absolute left-2 flex items-center justify-center">
            <Check className="size-4" aria-hidden="true" />
        </ComboboxPrimitive.ItemIndicator>

        {children}
    </ComboboxPrimitive.Item>
))
ComboboxItem.displayName = 'ComboboxItem'

export const ComboboxGroup = ComboboxPrimitive.Group

export const ComboboxGroupLabel = React.forwardRef<
    React.ComponentRef<typeof ComboboxPrimitive.GroupLabel>,
    React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
    <ComboboxPrimitive.GroupLabel
        ref={ref}
        className={cn('px-2 py-2 text-xs font-semibold', 'text-muted-foreground', className)}
        {...props}
    />
))
ComboboxGroupLabel.displayName = 'ComboboxGroupLabel'
