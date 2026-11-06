import * as React from 'react'
import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Combobox = ComboboxPrimitive.Root
export const ComboboxInput = React.forwardRef<
    React.ComponentRef<typeof ComboboxPrimitive.Input>,
    React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Input>
>(({ className, ...props }, ref) => (
    <ComboboxPrimitive.Input
        ref={ref}
        className={cn(
            'flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring',
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
        className={cn('absolute right-0 top-0 h-10 px-3', className)}
        {...props}
    >
        {children ?? <ChevronsUpDown className="size-4 opacity-50" />}
    </ComboboxPrimitive.Trigger>
))
ComboboxTrigger.displayName = 'ComboboxTrigger'
export const ComboboxContent = React.forwardRef<
    React.ComponentRef<typeof ComboboxPrimitive.Popup>,
    React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Popup>
>(({ className, ...props }, ref) => (
    <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner sideOffset={4}>
            <ComboboxPrimitive.Popup
                ref={ref}
                className={cn(
                    'z-50 max-h-80 min-w-48 overflow-auto rounded-md border bg-popover p-1 shadow-md',
                    className,
                )}
                {...props}
            />
        </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
))
ComboboxContent.displayName = 'ComboboxContent'
export const ComboboxList = ComboboxPrimitive.List
export const ComboboxEmpty = ComboboxPrimitive.Empty
export const ComboboxItem = React.forwardRef<
    React.ComponentRef<typeof ComboboxPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <ComboboxPrimitive.Item
        ref={ref}
        className={cn(
            'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-highlighted:bg-accent data-disabled:pointer-events-none data-disabled:opacity-50',
            className,
        )}
        {...props}
    >
        <ComboboxPrimitive.ItemIndicator className="absolute left-2">
            <Check className="size-4" />
        </ComboboxPrimitive.ItemIndicator>
        {children}
    </ComboboxPrimitive.Item>
))
ComboboxItem.displayName = 'ComboboxItem'
export const ComboboxGroup = ComboboxPrimitive.Group
export const ComboboxGroupLabel = ComboboxPrimitive.GroupLabel
