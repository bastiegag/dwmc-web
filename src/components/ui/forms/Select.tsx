import * as React from 'react'
import { Select as SelectPrimitive } from '@base-ui/react/select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

export const SelectTrigger = React.forwardRef<
    React.ComponentRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
            'flex h-10 w-full min-w-0 items-center justify-between gap-2',
            'rounded-md border border-input bg-card px-3 py-2',
            'text-sm text-foreground',

            'cursor-pointer transition-colors motion-reduce:transition-none',
            'outline-none',
            'focus-visible:ring-2 focus-visible:ring-ring',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-background',

            'data-invalid:border-destructive',
            'data-invalid:focus-visible:ring-destructive',

            'data-disabled:cursor-not-allowed',
            'data-disabled:opacity-50',

            className,
        )}
        {...props}
    >
        <span className="min-w-0 flex-1 truncate text-left">{children}</span>

        <SelectPrimitive.Icon className="shrink-0 text-muted-foreground">
            <ChevronDown className="size-4" aria-hidden="true" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = 'SelectTrigger'

export type SelectContentProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Popup> & {
    position?: 'item-aligned' | 'popper'
    sideOffset?: number
    align?: 'start' | 'center' | 'end'
}

export const SelectContent = React.forwardRef<
    React.ComponentRef<typeof SelectPrimitive.Popup>,
    SelectContentProps
>(
    (
        { className, children, position = 'popper', sideOffset = 4, align = 'start', ...props },
        ref,
    ) => (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Positioner
                alignItemWithTrigger={position === 'item-aligned'}
                sideOffset={position === 'popper' ? sideOffset : 0}
                align={align}
                className="z-50"
            >
                <SelectPrimitive.Popup
                    ref={ref}
                    className={cn(
                        'relative min-w-32 overflow-hidden',
                        'rounded-md border border-border',
                        'bg-popover text-popover-foreground',
                        'shadow-md outline-none',

                        position === 'popper' && 'min-w-(--anchor-width)',

                        'origin-(--transform-origin)',
                        'transition-[opacity,transform] duration-150',

                        'data-starting-style:opacity-0',
                        'data-starting-style:scale-95',
                        'data-ending-style:opacity-0',
                        'data-ending-style:scale-95',

                        'motion-reduce:transition-none',

                        className,
                    )}
                    {...props}
                >
                    <SelectPrimitive.ScrollUpArrow
                        className={cn(
                            'flex items-center justify-center',
                            'py-1 text-muted-foreground',
                        )}
                    >
                        <ChevronUp className="size-4" aria-hidden="true" />
                    </SelectPrimitive.ScrollUpArrow>

                    <SelectPrimitive.List className="max-h-96 overflow-y-auto overscroll-contain p-1">
                        {children}
                    </SelectPrimitive.List>

                    <SelectPrimitive.ScrollDownArrow
                        className={cn(
                            'flex items-center justify-center',
                            'py-1 text-muted-foreground',
                        )}
                    >
                        <ChevronDown className="size-4" aria-hidden="true" />
                    </SelectPrimitive.ScrollDownArrow>
                </SelectPrimitive.Popup>
            </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
    ),
)
SelectContent.displayName = 'SelectContent'

export const SelectItem = React.forwardRef<
    React.ComponentRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            'relative flex min-h-9 w-full items-center',
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
        <SelectPrimitive.ItemIndicator
            className={cn('absolute left-2', 'flex size-4 items-center justify-center')}
        >
            <Check className="size-4" aria-hidden="true" />
        </SelectPrimitive.ItemIndicator>

        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
))
SelectItem.displayName = 'SelectItem'

export const SelectGroupLabel = React.forwardRef<
    React.ComponentRef<typeof SelectPrimitive.GroupLabel>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.GroupLabel
        ref={ref}
        className={cn('px-2 py-2 text-xs font-semibold', 'text-muted-foreground', className)}
        {...props}
    />
))
SelectGroupLabel.displayName = 'SelectGroupLabel'

export const SelectSeparator = React.forwardRef<
    React.ComponentRef<typeof SelectPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
        ref={ref}
        className={cn('my-1 h-px bg-border', className)}
        {...props}
    />
))
SelectSeparator.displayName = 'SelectSeparator'

export const SelectScrollUpButton = SelectPrimitive.ScrollUpArrow
export const SelectScrollDownButton = SelectPrimitive.ScrollDownArrow
