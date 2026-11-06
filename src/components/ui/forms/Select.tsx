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
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
        )}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon>
            <ChevronDown className="size-5 opacity-50" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

export const SelectContent = React.forwardRef<
    React.ComponentRef<typeof SelectPrimitive.Popup>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Popup> & {
        position?: 'item-aligned' | 'popper'
    }
>(({ className, children, position = 'popper', ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
            className={cn(position === 'popper' && 'translate-y-1')}
            alignItemWithTrigger={position !== 'popper'}
        >
            <SelectPrimitive.Popup
                ref={ref}
                className={cn(
                    'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-starting-style:animate-in data-ending-style:animate-out data-ending-style:fade-out-0 data-starting-style:fade-in-0 data-ending-style:zoom-out-95 data-starting-style:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
                    className,
                )}
                {...props}
            >
                <SelectPrimitive.ScrollUpArrow className="flex items-center justify-center py-1">
                    <ChevronUp className="size-5" />
                </SelectPrimitive.ScrollUpArrow>
                <SelectPrimitive.List
                    className={cn(
                        'p-1',
                        position === 'popper' &&
                            'h-(--anchor-height) w-full min-w-(--anchor-width)',
                    )}
                >
                    {children}
                </SelectPrimitive.List>
                <SelectPrimitive.ScrollDownArrow className="flex items-center justify-center py-1">
                    <ChevronDown className="size-5" />
                </SelectPrimitive.ScrollDownArrow>
            </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Popup.displayName

export const SelectItem = React.forwardRef<
    React.ComponentRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
            className,
        )}
        {...props}
    >
        <span className="absolute left-2 flex size-3.5 items-center justify-center">
            <SelectPrimitive.ItemIndicator>
                <Check className="size-5" />
            </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export const SelectScrollUpButton = SelectPrimitive.ScrollUpArrow
export const SelectScrollDownButton = SelectPrimitive.ScrollDownArrow
